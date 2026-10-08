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
        _row("Langue du site", escape(str(q.get("lang") or "fr").upper())),
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


ACK = {
    "fr": {"subject": "Votre demande de devis a bien été reçue", "hello": "Bonjour,",
           "body": "Merci pour votre demande de devis. Nous l'avons bien reçue et un membre de notre équipe vous recontactera rapidement pour étudier vos pièces.",
           "recap": "Récapitulatif", "material": "Matériau principal", "machine": "Machine d'intérêt", "none": "Non précisée",
           "contact": "Pour toute question, répondez simplement à cet e-mail ou appelez-nous au",
           "foot": "Vous recevez cet e-mail car une demande de devis a été envoyée avec cette adresse sur le site OW Auto Grinding. Si ce n'est pas vous, ignorez ce message.",
           "mat": {"fonte": "Fonte", "acier": "Acier", "aluminium": "Aluminium", "autre": "Autre"}},
    "pt": {"subject": "O seu pedido de orçamento foi recebido", "hello": "Olá,",
           "body": "Obrigado pelo seu pedido de orçamento. Recebemo-lo e um membro da nossa equipa entrará em contacto brevemente para estudar as suas peças.",
           "recap": "Resumo", "material": "Material principal", "machine": "Máquina de interesse", "none": "Não indicada",
           "contact": "Para qualquer questão, responda a este e-mail ou ligue-nos para o",
           "foot": "Recebe este e-mail porque foi enviado um pedido de orçamento com este endereço no site OW Auto Grinding. Se não foi você, ignore esta mensagem.",
           "mat": {"fonte": "Ferro fundido", "acier": "Aço", "aluminium": "Alumínio", "autre": "Outro"}},
    "es": {"subject": "Hemos recibido su solicitud de presupuesto", "hello": "Hola,",
           "body": "Gracias por su solicitud de presupuesto. La hemos recibido y un miembro de nuestro equipo se pondrá en contacto con usted en breve para estudiar sus piezas.",
           "recap": "Resumen", "material": "Material principal", "machine": "Máquina de interés", "none": "No indicada",
           "contact": "Para cualquier consulta, responda a este e-mail o llámenos al",
           "foot": "Recibe este e-mail porque se envió una solicitud de presupuesto con esta dirección en el sitio de OW Auto Grinding. Si no ha sido usted, ignore este mensaje.",
           "mat": {"fonte": "Hierro fundido", "acier": "Acero", "aluminium": "Aluminio", "autre": "Otro"}},
    "en": {"subject": "We have received your quote request", "hello": "Hello,",
           "body": "Thank you for your quote request. We have received it and a member of our team will contact you shortly to study your parts.",
           "recap": "Summary", "material": "Main material", "machine": "Machine of interest", "none": "Not specified",
           "contact": "For any question, simply reply to this email or call us on",
           "foot": "You are receiving this email because a quote request was sent with this address on the OW Auto Grinding website. If this was not you, please ignore this message.",
           "mat": {"fonte": "Cast iron", "acier": "Steel", "aluminium": "Aluminium", "autre": "Other"}},
}


def quote_ack_html(q: dict) -> tuple:
    c = ACK.get(q.get("lang") or "fr", ACK["fr"])
    site = os.environ["SITE_URL"].rstrip("/")
    phone = os.environ["CONTACT_PHONE"]
    rows = _row(c["material"], escape(c["mat"].get(q["material"], q["material"]))) + _row(c["machine"], escape(q.get("machine") or c["none"]))
    html = (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 0">'
        '<tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;font-family:Arial,sans-serif">'
        '<tr><td style="background:#0d1420;padding:20px 28px;color:#ffffff;font-size:18px;font-weight:bold">'
        'OW <span style="color:#c5b358">Auto Grinding</span></td></tr>'
        '<tr><td style="padding:28px;color:#0d1420;font-size:15px;line-height:1.6">'
        f'<p style="margin:0 0 12px">{escape(c["hello"])}</p>'
        f'<p style="margin:0 0 20px">{escape(c["body"])}</p>'
        f'<div style="font-size:11px;letter-spacing:2px;color:#2b4c6f;font-weight:bold;margin-bottom:6px">{escape(c["recap"]).upper()}</div>'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #dce2e9">{rows}</table>'
        f'<p style="margin:20px 0 0;font-size:14px">{escape(c["contact"])} <a href="tel:{escape(phone.replace(" ", ""))}" style="color:#2b4c6f">{escape(phone)}</a>.</p>'
        f'<p style="margin:20px 0 0"><a href="{escape(site)}" style="display:inline-block;background:#2b4c6f;color:#ffffff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold;font-size:14px">OW Auto Grinding</a></p>'
        '</td></tr>'
        f'<tr><td style="padding:16px 28px;border-top:1px solid #dce2e9;font-size:11px;color:#64748b">{escape(c["foot"])}</td></tr>'
        '</table></td></tr></table>'
    )
    return c["subject"], html


async def send_quote_ack(q: dict) -> None:
    subject, html = quote_ack_html(q)
    try:
        eid = await send_email(to=[q["email"]], subject=subject, html=html)
        logger.info(f"Quote ack sent: {eid}")
    except Exception as e:
        logger.error(f"Quote ack not sent: {e}")


async def notify_new_quote(q: dict) -> None:
    recipients = [r.strip() for r in os.environ["QUOTE_ALERT_EMAILS"].split(",") if r.strip()]
    subject = f"Nouvelle demande de devis — {q.get('machine') or 'machine non précisée'}"
    try:
        eid = await send_email(to=recipients, subject=subject, html=quote_alert_html(q))
        logger.info(f"Quote alert sent: {eid}")
    except Exception as e:
        logger.error(f"Quote alert not sent: {e}")
