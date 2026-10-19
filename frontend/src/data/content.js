export const BRAND = {
  name: "GrindTek",
  domain: "www.grindtek-automation.com",
  company: "OVERKKAST SAS",
  address: "Route de Moyembrie, 02380 Coucy-le-Château-Auffrique, France",
  phone: "01 84 80 86 99",
  phoneHref: "tel:+33184808699",
  email: "contact@overkkast.com",
};

export const NAV = ["machines", "resultats", "comparatif", "roi", "processus", "faq"];

export const MATERIALS = ["fonte", "acier", "aluminium", "autre"];

export const MACHINES = [
  { id: "GV 120", img: "/img/gv120.png", dh: [350, 200], load: 25, d1: 3.7, d2: 3.5, weight: 2085, dims: [2141, 1864, 2340], double: false },
  { id: "GV 130", img: "/img/gv130.png", dh: [500, 250], load: 40, d1: 5.5, d2: 3.5, weight: 2500, dims: [2555, 2120, 2588], double: false },
  { id: "GV 230", img: "/img/gv230.png", dh: [500, 300], load: 40, d1: 7.5, d2: 3.5, weight: 3300, dims: [3030, 2400, 2300], double: true, featured: true },
  { id: "GV 270", img: "/img/gv270.png", dh: [700, 400], load: 90, d1: 7.5, d2: 6, weight: 6210, dims: [3948, 2223, 2953], double: true },
  { id: "GV 2100", img: "/img/gv2100.png", dh: [1000, 400], load: 120, d1: 7.5, d2: 6, weight: 6420, dims: [4528, 2920, 2922], double: true },
];

export const num = (x, t) => x.toLocaleString(t.locale).replace(/[\u202f\u00a0]/g, "\u00a0");

export const specValue = (m, k, t) => {
  if (k === "dh") return `${num(m.dh[0], t)} × ${num(m.dh[1], t)} mm`;
  if (k === "dims") return `${m.dims.map((x) => num(x, t)).join(" × ")} mm`;
  if (k === "load" || k === "weight") return `${num(m[k], t)} kg`;
  if (k === "d1" || k === "d2") return `${num(m[k], t)} kW`;
  return m.double ? t.machines.double : t.machines.single;
};

export const SPEC_KEYS = ["dh", "load", "d1", "d2", "weight", "dims", "type"];

export const DIFF_KEYS = ["prog", "setup", "fixture", "pre", "laser", "disc"];

export const SERIES_KEYS = ["petite", "moyenne", "grande"];

