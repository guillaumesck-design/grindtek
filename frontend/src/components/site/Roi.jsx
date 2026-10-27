import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { SectionHead, FadeUp } from "./Reveal";
import { scrollToId } from "@/lib/api";
import { useLang } from "@/i18n";

const fmt = (n, d = 0, loc = "fr-FR") => (Number.isFinite(n) ? n.toLocaleString(loc, { maximumFractionDigits: d, minimumFractionDigits: d }) : "—");

const FIELDS = [
  { k: "volume", min: 10000, max: 500000, step: 5000 },
  { k: "manual", min: 20, max: 150, step: 5 },
  { k: "cnc", min: 50, max: 250, step: 5 },
  { k: "cost", min: 15, max: 80, step: 1 },
  { k: "scrap", min: 0, max: 10, step: 0.5 },
  { k: "value", min: 1, max: 200, step: 1 },
  { k: "invest", min: 50000, max: 600000, step: 10000 },
];

const DEFAULTS = { volume: 120000, manual: 60, cnc: 130, cost: 32, scrap: 3, value: 18, invest: 180000 };

const Field = ({ f, v, set, t }) => (
  <div data-testid={`roi-field-${f.k}`}>
    <div className="flex items-baseline justify-between gap-4 mb-3">
      <label className="text-sm font-medium text-ink">{t.roi.fields[f.k][0]}</label>
      <span className="font-mono text-sm text-steel font-medium whitespace-nowrap" data-testid={`roi-value-${f.k}`}>{fmt(v, f.step < 1 ? 1 : 0, t.locale)} {t.roi.fields[f.k][1]}</span>
    </div>
    <Slider data-testid={`roi-slider-${f.k}`} value={[v]} min={f.min} max={f.max} step={f.step} onValueChange={([x]) => set(f.k, x)} />
  </div>
);

const Out = ({ label, value, big, testId }) => (
  <div className={big ? "col-span-2 border-b border-white/15 pb-6" : ""}>
    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300">{label}</div>
    <div data-testid={testId} className={`font-display font-extrabold mt-1 leading-none ${big ? "text-5xl md:text-6xl text-gold" : "text-2xl md:text-3xl text-white"}`}>{value}</div>
  </div>
);

export const Roi = () => {
  const [s, setS] = useState(DEFAULTS);
  const { t } = useLang();
  const c = t.roi;
  const L = t.locale;
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => {
    const hManual = s.volume / s.manual;
    const hCnc = s.volume / s.cnc;
    const hours = Math.max(0, hManual - hCnc);
    const labour = hours * s.cost;
    const scrap = s.volume * (s.scrap / 100) * s.value;
    const total = labour + scrap;
    return { gain: (s.cnc / s.manual - 1) * 100, hours, labour, scrap, total, payback: total > 0 ? (s.invest / total) * 12 : Infinity };
  }, [s]);

  return (
    <section id="roi" data-testid="roi-section" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <SectionHead index="07" label={c.label} lines={c.lines}>
          {c.text}
        </SectionHead>
        <FadeUp className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white border border-line p-6 md:p-10 space-y-8">
            {FIELDS.map((f) => <Field key={f.k} f={f} v={s[f.k]} set={set} t={t} />)}
            <button data-testid="roi-reset-btn" onClick={() => setS(DEFAULTS)} className="font-mono text-xs uppercase tracking-[0.14em] text-slate-600 hover:text-ink underline underline-offset-4">
              {c.reset}
            </button>
          </div>
          <div className="lg:col-span-5 bg-ink text-white p-6 md:p-10 flex flex-col lg:sticky lg:top-24 self-start w-full">
            <div className="eyebrow !text-slate-300 mb-6">{c.est}</div>
            <div className="grid grid-cols-2 gap-6">
              <Out big label={c.total} value={`${fmt(r.total, 0, L)} €`} testId="roi-total" />
              <Out label={c.gain} value={`+${fmt(Math.floor(r.gain), 0, L)}${t.pct}`} testId="roi-gain" />
              <Out label={c.hours} value={`${fmt(r.hours, 0, L)} h`} testId="roi-hours" />
              <Out label={c.labour} value={`${fmt(r.labour, 0, L)} €`} testId="roi-labour" />
              <Out label={c.scrapSave} value={`${fmt(r.scrap, 0, L)} €`} testId="roi-scrap" />
            </div>
            <div className="mt-8 p-5 bg-white/5 border border-white/10">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300">{c.payback}</div>
              <div className="font-display font-extrabold text-4xl mt-1" data-testid="roi-payback">
                {Number.isFinite(r.payback) ? `${fmt(r.payback, 1, L)} ${c.months}` : "—"}
              </div>
            </div>
            <p className="mt-6 text-xs text-slate-300 leading-relaxed">
              {c.disclaimer}
            </p>
            <button
              data-testid="roi-study-btn"
              onClick={() => scrollToId("contact")}
              className="group mt-6 inline-flex items-center justify-center gap-2 bg-gold text-ink font-semibold px-6 py-3.5 rounded-full hover:bg-white transition-colors"
            >
              {c.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
