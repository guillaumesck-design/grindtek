import { jsPDF } from "jspdf";
import { BRAND, SPEC_KEYS, specValue } from "@/data/content";

const INK = [13, 20, 32];
const STEEL = [43, 76, 111];
const GOLD = [197, 179, 88];
const MUTED = [71, 85, 105];
const LINE = [220, 226, 233];
const PAPER = [244, 246, 248];
const R = 190;

const loadImg = async (src) => {
  const blob = await (await fetch(src)).blob();
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
};

const drawMark = (doc, cx, cy, s) => {
  const k = s / 32;
  doc.setLineCap("round");
  doc.setLineJoin("round");
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(3 * k);
  doc.circle(cx, cy, 11.5 * k, "S");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(2.6 * k);
  doc.lines([[3 * k, 8.5 * k], [4 * k, -6 * k], [4 * k, 6 * k], [3 * k, -8.5 * k]], cx - 7 * k, cy - 4 * k, [1, 1], "S", false);
};

const header = (doc, t) => {
  doc.setFillColor(...INK);
  doc.rect(0, 0, 210, 30, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 30, 210, 1, "F");
  drawMark(doc, 26, 15, 16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold").setFontSize(15).text("OW", 37, 14.5);
  doc.setFont("courier", "normal").setFontSize(7).setTextColor(203, 213, 225).text("AUTO GRINDING", 37, 19.5);
  doc.setTextColor(...GOLD).setFontSize(8).text(t.pdf.sheet, R, 13.5, { align: "right" });
  doc.setTextColor(255, 255, 255).text(BRAND.domain, R, 19.5, { align: "right" });
};

const title = (doc, m, t) => {
  doc.setTextColor(...INK).setFont("helvetica", "bold").setFontSize(34).text(m.id, 20, 50);
  doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...MUTED);
  doc.text(t.machines.subtitle, 20, 58);
  const label = specValue(m, "type", t).toUpperCase();
  doc.setFont("courier", "bold").setFontSize(8);
  const w = doc.getTextWidth(label) + 8;
  doc.setFillColor(...STEEL);
  doc.roundedRect(R - w, 42, w, 8, 4, 4, "F");
  doc.setTextColor(255, 255, 255).text(label, R - w / 2, 47.2, { align: "center" });
};

const specs = (doc, m, img, t) => {
  doc.setFillColor(...PAPER);
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.rect(20, 66, 80, 80, "FD");
  doc.addImage(img, "PNG", 24, 70, 72, 72);
  doc.setFont("courier", "normal").setFontSize(7).setTextColor(...MUTED).text(`FIG. ${m.id}`, 23, 70);
  doc.setFont("courier", "bold").setFontSize(8).setTextColor(...STEEL).text(t.pdf.specs, 108, 70);
  SPEC_KEYS.forEach((k, i) => {
    const label = t.machines.rows[k];
    const val = specValue(m, k, t);
    const y = 81 + i * 10;
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED).text(label, 108, y);
    doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...INK).text(val, R, y, { align: "right" });
    const x1 = 108 + doc.setFont("helvetica", "normal").setFontSize(9).getTextWidth(label) + 2;
    const x2 = R - doc.setFont("helvetica", "bold").setFontSize(10).getTextWidth(val) - 2;
    doc.setLineDashPattern([0.4, 1], 0).setDrawColor(184, 195, 207).line(x1, y - 0.8, x2, y - 0.8);
    doc.setLineDashPattern([], 0);
  });
};

const results = (doc, t) => {
  const items = t.pdf.results;
  items.forEach(([big, lab], i) => {
    const x = 20 + i * 58;
    doc.setFillColor(...(i === 0 ? INK : PAPER));
    doc.rect(x, 154, 54, 24, "F");
    doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...(i === 0 ? GOLD : STEEL)).text(big, x + 5, 165);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...(i === 0 ? [203, 213, 225] : MUTED)).text(lab, x + 5, 172.5);
  });
  doc.setFontSize(7).setTextColor(...MUTED).text(t.pdf.resultsNote, 20, 183);
};

const advantages = (doc, t) => {
  doc.setFont("courier", "bold").setFontSize(8).setTextColor(...STEEL).text(t.pdf.adv, 20, 194);
  t.diffs.items.forEach((d, i) => {
    const x = 20 + (i % 2) * 88;
    const y = 202 + Math.floor(i / 2) * 19;
    doc.setFillColor(...GOLD).rect(x, y - 2.6, 2.4, 2.4, "F");
    doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(...INK).text(d.t, x + 5, y);
    doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(...MUTED);
    doc.text(doc.splitTextToSize(d.d, 77).slice(0, 3), x + 5, y + 4.2, { lineHeightFactor: 1.3 });
  });
};

const footer = (doc, t) => {
  doc.setFillColor(...INK).rect(0, 262, 210, 35, "F");
  doc.setFillColor(...GOLD).rect(0, 262, 210, 0.8, "F");
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(255, 255, 255).text(t.pdf.cta, 20, 273);
  doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(203, 213, 225);
  doc.text(`OW Auto Grinding — ${BRAND.company}`, 20, 280);
  doc.text(BRAND.address, 20, 285);
  doc.setTextColor(...GOLD).text(`${t.pdf.tel} ${BRAND.phone}  ·  ${BRAND.email}  ·  ${BRAND.domain}`, 20, 290);
  doc.setFontSize(6.5).setTextColor(203, 213, 225).text(t.pdf.disc1, R, 280, { align: "right" });
  doc.text(t.pdf.disc2, R, 284, { align: "right" });
};

export async function downloadSpecPdf(m, t) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setProperties({ title: `${t.pdf.sheet} ${m.id} — OW Auto Grinding`, author: "OW Auto Grinding" });
  const img = await loadImg(m.img);
  header(doc, t);
  title(doc, m, t);
  specs(doc, m, img, t);
  results(doc, t);
  advantages(doc, t);
  footer(doc, t);
  doc.save(`OW-Auto-Grinding-${m.id.replace(" ", "")}-${t.pdf.file}.pdf`);
}
