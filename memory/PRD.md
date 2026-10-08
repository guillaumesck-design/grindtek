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

## Placeholders to complete
- Contact email, capital social, hébergeur (legal notice)
- ROI default investment (180 000 €) is a hypothesis
- Photos still show AW branding (user will replace)

## Backlog
- P1: Email notification on new quote (Resend)
- P1: Replace images/logo with OW-branded assets
- P2: Downloadable PDF spec sheets per machine; EN/DE versions; SEO meta per section
