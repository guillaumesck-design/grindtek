# PRD — OW Auto Grinding (www.owgrinding.com)

## Original problem statement
voici un site internet que je souhaiterais entierement copié, l'objectif étant de ne changer que la marque de la socité (AW Auto grinding en OW Auto grinding). je souhaite egalement le traduire entièrement en français. je vais ensuite faire queqlues modification d'image et de logo si necessaire. le future domaine du site sera (https://www.owgrinding.com). Voici le site existant: https://www.awgrinding.com.br/ . je souhaite creer un nouveau site pour OW Auto grinding en gardant 100% des informations de https://www.awgrinding.com.br/. Utilise le code couleur de ce site: www.overkkast.com pour creer le nouveau site. Structure du site : Une seule page longue (one-page), plus moderne et plus riche. Direction artistique (différente d'AW) : Clair & technique — blanc/gris clair, accent bleu acier, style « fiche produit » épuré. Nouvelles sections à ajouter: Comparatif « notre CNC vs cellule robotisée vs manuel »; Calculateur de ROI / gain de productivité interactif; Processus en 5 étapes; FAQ; Zone d'intervention / Europe; Mentions légales + Politique de confidentialité

## User choices
- User is AW / authorized partner (reuse of AW content & photos allowed); OW distributes Weijing machines in Europe
- Quote form → stored in DB + protected admin page
- Legal/contact details = Overkkast SAS (public registry data)
- Colours: Overkkast gold #c5b358 + ink/greys, combined with light + steel-blue technical direction

## Architecture
- Frontend: React (CRA/craco), Tailwind, shadcn, framer-motion, lenis. Pages: `/` (one-page), `/admin`
- Content in `src/data/content.js`; sections in `src/components/site/*`
- Images saved locally in `public/img` (from awgrinding.com.br)
- Backend: FastAPI + MongoDB. JWT httpOnly cookie auth (seeded admin from .env), brute-force lockout
- API: POST /api/quotes (public), GET/PATCH/DELETE /api/quotes (admin), /api/auth/login|logout|me|refresh

## Personas
- Foundry managers / methods engineers (FR & Europe) looking to automate deburring
- OW sales admin reviewing quote requests

## Implemented (2026-10-08)
- One-page FR site: hero (masked reveal, parallax + 3D tilt), marquee, solutions/materials, GV catalogue (5 spec sheets), GV 230 featured, results (+116 %, 0 % rebut, benefits), 3 pillars, about + Weijing, 5 challenges, 6 differentiators bento, field photo loop, low/medium/high series, comparison table, ROI calculator, 5-step process, Europe radar map, FAQ, quote form, footer, legal & privacy dialogs
- Original OW SVG logo + favicon
- Admin dashboard: login, list, status update, delete, filter, CSV export

## Implemented (2026-10-08, iteration 3)
- 4 languages FR / PT / ES / EN (`src/i18n/*.js`, LangProvider + LangSwitcher in nav & mobile menu). FR default; manual choice saved in localStorage (`ow_lang`); `<html lang>` updated
- Auto language by IP via `GET /api/geo` (CF-IPCountry header, else ipwho.is → ipapi.co fallback, in-memory cache): FR→fr, PT→pt, ES→es, ZA→en, others→fr. Only runs when no saved choice
- Everything translated: all sections, form, legal & privacy, PDF spec sheets (locale-aware number formatting)
- Prospect acknowledgement email in the visitor's language (fixed template, no echo of user free text, reply-to contact@overkkast.com), max 1 per address / 24 h; anti-abuse: honeypot field + 5 quotes / IP / hour (TTL collection `quote_rate`)
- Quote stores `lang`; shown in admin table and team alert

## Implemented (2026-10-08, iteration 2)
- Instant email alert on each new quote (Emergent-managed Resend, `backend/email_service.py`), recipients from `QUOTE_ALERT_EMAILS` (contact@overkkast.com), sent in background, link to SITE_URL/admin
- Branded A4 PDF spec sheet per GV machine (client-side jsPDF, `src/lib/specPdf.js`): specs, photo, key results, 6 advantages, OW contact block. Buttons in catalogue + GV 230 section
- Contact email set to contact@overkkast.com site-wide (contact, legal, PDF)
- Backend validates machine against the 5 GV ids

## Placeholders to complete
- Capital social, hébergeur (legal notice)
- ROI default investment (180 000 €) is a hypothesis
- Photos still show AW branding (user will replace)

## Backlog
- P1: Confirmation email to the prospect after submission (done in iteration 3)
- P2: Map Brazil (BR) to PT if desired; translated SEO meta per language
- P1: Replace images/logo with OW-branded assets
- P2: Downloadable PDF spec sheets per machine; EN/DE versions; SEO meta per section
