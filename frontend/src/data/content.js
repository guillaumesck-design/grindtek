export const BRAND = {
  name: "OW Auto Grinding",
  domain: "www.owgrinding.com",
  company: "OVERKKAST SAS",
  address: "Route de Moyembrie, 02380 Coucy-le-Château-Auffrique, France",
  phone: "01 84 80 86 99",
  phoneHref: "tel:+33184808699",
  email: "contact@overkkast.com",
};

export const NAV = [
  { id: "machines", label: "Machines" },
  { id: "resultats", label: "Résultats" },
  { id: "comparatif", label: "Comparatif" },
  { id: "roi", label: "Calculateur ROI" },
  { id: "processus", label: "Processus" },
  { id: "europe", label: "Europe" },
  { id: "faq", label: "FAQ" },
];

export const MATERIALS = [
  { value: "fonte", label: "Fonte" },
  { value: "acier", label: "Acier" },
  { value: "aluminium", label: "Aluminium" },
  { value: "autre", label: "Autre" },
];

export const MACHINES = [
  { id: "GV 120", img: "/img/gv120.png", dh: "350 × 200 mm", load: "25 kg", d1: "3,7 kW", d2: "3,5 kW", weight: "2 085 kg", dims: "2 141 × 1 864 × 2 340 mm", type: "Palette simple" },
  { id: "GV 130", img: "/img/gv130.png", dh: "500 × 250 mm", load: "40 kg", d1: "5,5 kW", d2: "3,5 kW", weight: "2 500 kg", dims: "2 555 × 2 120 × 2 588 mm", type: "Palette simple" },
  { id: "GV 230", img: "/img/gv230.png", dh: "500 × 300 mm", load: "40 kg", d1: "7,5 kW", d2: "3,5 kW", weight: "3 300 kg", dims: "3 030 × 2 400 × 2 300 mm", type: "Double palette", featured: true },
  { id: "GV 270", img: "/img/gv270.png", dh: "700 × 400 mm", load: "90 kg", d1: "7,5 kW", d2: "6 kW", weight: "6 210 kg", dims: "3 948 × 2 223 × 2 953 mm", type: "Double palette" },
  { id: "GV 2100", img: "/img/gv2100.png", dh: "1 000 × 400 mm", load: "120 kg", d1: "7,5 kW", d2: "6 kW", weight: "6 420 kg", dims: "4 528 × 2 920 × 2 922 mm", type: "Double palette" },
];

export const SPEC_ROWS = [
  ["dh", "Diamètre × hauteur pièce"],
  ["load", "Poids total (pièce + fixture)"],
  ["d1", "Puissance disque 1"],
  ["d2", "Puissance disque 2"],
  ["weight", "Poids machine"],
  ["dims", "Encombrement (L × l × H)"],
  ["type", "Type"],
];

export const BENEFITS = [
  "Des conditions de travail nettement améliorées pour l'opérateur.",
  "Un aspect visuel de la pièce plus soigné et plus régulier.",
  "Une consommation d'abrasifs en baisse.",
  "Moins de turnover dans les équipes de parachèvement.",
];

export const PILLARS = [
  { t: "Un investissement initial accessible", d: "Notre solution CNC demande un budget nettement inférieur à celui d'une cellule robotisée classique : l'automatisation devient réaliste pour les fonderies de taille moyenne." },
  { t: "Un fixture simple et économique", d: "Rapide à fabriquer et peu coûteux, le fixture permet de passer d'une référence à l'autre sans investissements supplémentaires lourds." },
  { t: "Une programmation à la portée de vos équipes", d: "L'interface est intuitive : vos équipes internes programment elles-mêmes, sans recourir à un spécialiste en robotique." },
];

export const CHALLENGES = [
  "Pénurie de main-d'œuvre à l'ébavurage",
  "Retouches fréquentes en finition",
  "Goulots d'étranglement dans la production",
  "Délais de livraison difficiles à tenir",
  "Risques opérationnels au poste de parachèvement",
];

export const DIFFS = [
  { k: "prog", t: "Programmation facilitée", d: "Programmation par points, via une interface pensée spécifiquement pour l'ébavurage. Les programmes se créent vite, simplement et efficacement." },
  { k: "setup", t: "Changement de série express", d: "Changer de fixture et charger un nouveau programme prend moins de 15 minutes : l'automatisation reste pertinente même pour les petits lots." },
  { k: "fixture", t: "Fixtures simples et économiques", d: "Véritables berceaux pour vos pièces brutes, les fixtures sont faciles à fabriquer, abordables et pratiques au quotidien." },
  { k: "pre", t: "Pré-usinage", d: "La précision et la constance de nos systèmes CNC permettent des opérations de pré-usinage sur de nombreuses pièces, pour réduire coûts et étapes en aval." },
  { k: "laser", t: "Mesure laser", d: "Le système laser détecte les variations dimensionnelles des pièces et prévient les collisions : un process sûr et fiable." },
  { k: "disc", t: "Disques diamantés haute performance", d: "Conçus pour l'ébavurage : fort pouvoir d'enlèvement, durabilité exceptionnelle et meilleur rendement de production." },
];

export const SERIES = [
  { k: "petite", t: "Petite série", d: "Fixture économique et changement de série en moins de 15 minutes : même les petits lots deviennent rentables à automatiser." },
  { k: "moyenne", t: "Moyenne série", d: "Programmation par points réalisée en interne : vous alternez les références sans dépendre d'un intégrateur." },
  { k: "grande", t: "Grande série", d: "Cadence et répétabilité CNC : jusqu'à 130 pièces/heure pour un seul opérateur dans notre cas de référence, sans rebut de finition." },
];

export const COMPARE = {
  cols: ["CNC OW Auto Grinding", "Cellule robotisée", "Ébavurage manuel"],
  rows: [
    ["Investissement initial", "Nettement inférieur à une cellule robotisée", "Élevé (robot, périphériques, intégration)", "Faible en matériel, élevé en main-d'œuvre"],
    ["Fixtures / outillage", "Berceau simple, rapide et peu coûteux", "Préhenseurs et posages spécifiques", "Aucun, mais dépend du geste de l'opérateur"],
    ["Programmation", "Par points, par vos équipes internes", "Spécialiste en robotique souvent requis", "Sans objet"],
    ["Changement de série", "Moins de 15 minutes", "Plus long (reprogrammation, réglages)", "Immédiat, mais qualité variable"],
    ["Productivité (cas de référence)", "130 pièces/h pour 1 opérateur", "Variable selon l'intégration", "60 pièces/h pour 1 opérateur"],
    ["Rebut en finition", "0 % constaté", "Dépend de la rigidité et du process", "3 % constaté"],
    ["Pré-usinage", "Possible grâce à la précision CNC", "Limité par la rigidité du bras", "Non"],
    ["Conditions de travail", "Opérateur hors zone de meulage", "Opérateur hors zone", "Exposition aux poussières, bruit et vibrations"],
    ["Petites séries", "Rentables", "Peu adaptées", "Adaptées, coût unitaire élevé"],
  ],
};

export const STEPS = [
  { t: "Analyse de vos pièces", d: "Vous nous transmettez plans, photos, matériaux et volumes. Nous qualifions l'opération d'ébavurage à automatiser." },
  { t: "Évaluation technique", d: "Étude de faisabilité, choix du modèle GV adapté et estimation du temps de cycle." },
  { t: "Proposition & fixtures", d: "Offre détaillée, conception des fixtures et préparation des premiers programmes." },
  { t: "Installation & formation", d: "Mise en service sur site et formation de vos équipes à la programmation par points." },
  { t: "Accompagnement", d: "Suivi de production, consommables (disques diamantés) et support technique dans la durée." },
];

export const FAQ = [
  { q: "Quels matériaux pouvez-vous ébavurer ?", a: "Nos machines traitent les pièces de fonderie en fonte, acier, aluminium et autres alliages coulés." },
  { q: "En quoi une CNC dédiée diffère-t-elle d'une cellule robotisée ?", a: "Une machine CNC 5 axes dédiée à l'ébavurage demande un investissement nettement inférieur, utilise des fixtures simples et se programme par vos équipes, sans spécialiste en robotique. Sa précision permet aussi du pré-usinage." },
  { q: "Combien de temps faut-il pour changer de référence ?", a: "Changer de fixture et charger un nouveau programme prend moins de 15 minutes, ce qui rend l'automatisation intéressante même en petite série." },
  { q: "Qui programme la machine ?", a: "Vos équipes internes. La programmation se fait par points, via une interface conçue spécifiquement pour l'ébavurage." },
  { q: "Quelle taille de pièce peut-on traiter ?", a: "De 350 × 200 mm (25 kg pièce + fixture) sur la GV 120 jusqu'à 1 000 × 400 mm (120 kg) sur la GV 2100." },
  { q: "Quels gains peut-on espérer ?", a: "Dans notre cas de référence, la productivité est passée de 60 à 130 pièces/heure pour un opérateur (+116 %) et le rebut en finition de 3 % à 0 %. Chaque projet fait l'objet d'une évaluation technique." },
  { q: "Qui fabrique les machines ?", a: "Les machines sont développées par Weijing, fabricant international de référence, avec qui OW Auto Grinding collabore pour la distribution en Europe." },
  { q: "Comment obtenir un devis ?", a: "Remplissez le formulaire de demande de devis : nous vous recontactons pour étudier vos pièces et vous proposer la configuration adaptée." },
];

export const CITIES = [
  ["Londres", -0.13, 51.51], ["Bruxelles", 4.35, 50.85], ["Amsterdam", 4.9, 52.37], ["Luxembourg", 6.13, 49.61],
  ["Berlin", 13.4, 52.52], ["Munich", 11.58, 48.14], ["Zurich", 8.54, 47.37], ["Milan", 9.19, 45.46],
  ["Lyon", 4.84, 45.76], ["Barcelone", 2.17, 41.39], ["Madrid", -3.7, 40.42], ["Lisbonne", -9.14, 38.72],
  ["Prague", 14.42, 50.08], ["Vienne", 16.37, 48.21], ["Varsovie", 21.01, 52.23], ["Bordeaux", -0.58, 44.84],
];

export const GALLERY = ["/img/c1.webp", "/img/c2.webp", "/img/c3.webp", "/img/c4.webp", "/img/c5.webp", "/img/c6.webp", "/img/c7.webp"];
