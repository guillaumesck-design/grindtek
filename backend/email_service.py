import os
import re
import ipaddress
import logging
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import httpx
from fastapi import HTTPException

logger = logging.getLogger("ow.email")

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} ≠ real link host {real!r} (G3)")


async def send_email(*, to: list, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": to, "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if EMAIL_REPLY_TO:
        payload["contact_email"] = EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(f"{EMAIL_BASE_URL}/api/v1/email/send",
                                     headers={"X-Email-Key": EMAIL_KEY}, json=payload)
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        try:
            code = e.response.json().get("code", "")
        except ValueError:
            code = ""
        if code in ("insufficient_credits", "integration_disabled", "daily_limit_reached"):
            logger.warning(f"Email paused: {code} ({e.response.status_code}): {e.response.text}")
            raise HTTPException(status_code=503, detail="Email is temporarily unavailable")
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


MAT = {"fonte": "Fonte", "acier": "Acier", "aluminium": "Aluminium", "autre": "Autre"}


def _row(label: str, value: str) -> str:
    return (f'<tr><td style="padding:8px 0;color:#475569;font-size:13px;width:170px;vertical-align:top">{label}</td>'
            f'<td style="padding:8px 0;color:#0d1420;font-size:14px;font-weight:bold">{value}</td></tr>')


def quote_alert_html(q: dict) -> str:
    email = escape(q["email"])
    phone = escape(q["phone"])
    tel = re.sub(r"[^0-9+]", "", q["phone"])
    admin_url = f'{os.environ["SITE_URL"].rstrip("/")}/admin'
    rows = "".join([
        _row("Nom", escape(q["name"])),
        _row("Entreprise", escape(q["company"])),
        _row("E-mail", f'<a href="mailto:{email}" style="color:#2b4c6f">{email}</a>'),
        _row("Téléphone", f'<a href="tel:{escape(tel)}" style="color:#2b4c6f">{phone}</a>'),
        _row("Matériau principal", escape(MAT.get(q["material"], q["material"]))),
        _row("Machine d'intérêt", escape(q.get("machine") or "Non précisée")),
        _row("Message", escape(q.get("message") or "—").replace("\n", "<br>")),
    ])
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 0">'
        '<tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;font-family:Arial,sans-serif">'
        '<tr><td style="background:#0d1420;padding:20px 28px;color:#ffffff;font-size:18px;font-weight:bold">'
        'OW <span style="color:#c5b358">Auto Grinding</span>'
        '<div style="font-size:11px;letter-spacing:2px;color:#cbd5e1;font-weight:normal;margin-top:4px">NOUVELLE DEMANDE DE DEVIS</div></td></tr>'
        '<tr><td style="padding:28px">'
        '<p style="margin:0 0 16px;color:#0d1420;font-size:15px">Une nouvelle demande de devis vient d\'être envoyée depuis le site.</p>'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #dce2e9">{rows}</table>'
        f'<p style="margin:24px 0 0"><a href="{escape(admin_url)}" style="display:inline-block;background:#2b4c6f;color:#ffffff;'
        'padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold;font-size:14px">Ouvrir l\'espace admin</a></p>'
        '</td></tr>'
        '<tr><td style="padding:16px 28px;border-top:1px solid #dce2e9;font-size:11px;color:#64748b">'
        'Notification automatique envoyée par OW Auto Grinding.</td></tr>'
        '</table></td></tr></table>'
    )


async def notify_new_quote(q: dict) -> None:
    recipients = [r.strip() for r in os.environ["QUOTE_ALERT_EMAILS"].split(",") if r.strip()]
    subject = f"Nouvelle demande de devis — {q.get('machine') or 'machine non précisée'}"
    try:
        eid = await send_email(to=recipients, subject=subject, html=quote_alert_html(q))
        logger.info(f"Quote alert sent: {eid}")
    except Exception as e:
        logger.error(f"Quote alert not sent: {e}")
