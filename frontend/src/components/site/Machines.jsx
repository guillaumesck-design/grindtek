import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Scale } from "lucide-react";
import { SectionHead, FadeUp, EASE } from "./Reveal";
import { MACHINES, SPEC_KEYS, specValue } from "@/data/content";
import { requestMachine, scrollToId } from "@/lib/api";
import { PdfButton } from "./PdfButton";
import { useLang } from "@/i18n";

const ModelList = ({ active, setActive, t }) => (
  <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-5 px-5 lg:mx-0 lg:px-0" data-lenis-prevent-wheel>
    {MACHINES.map((m, i) => (
      <button
        key={m.id}
        data-testid={`machine-tab-${m.id.replace(" ", "").toLowerCase()}`}
        onClick={() => setActive(i)}
        className={`group shrink-0 text-left px-5 py-4 border transition-colors duration-300 min-w-[160px] ${
          active === i ? "bg-ink text-white border-ink" : "bg-white border-line hover:border-steel-2"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className={`font-mono text-xs ${active === i ? "text-gold" : "text-slate-500"}`}>0{i + 1}</span>
          {m.featured && <span className="font-mono text-[10px] uppercase tracking-widest bg-gold text-ink px-2 py-0.5">{t.machines.featured}</span>}
        </div>
        <div className="font-display font-bold text-2xl mt-1">{m.id}</div>
        <div className={`font-mono text-xs mt-1 ${active === i ? "text-slate-300" : "text-slate-500"}`}>{specValue(m, "dh", t)} · {specValue(m, "type", t)}</div>
      </button>
    ))}
  </div>
);

const SpecSheet = ({ m, i, t }) => (
  <div className="relative tick border border-line bg-white grid md:grid-cols-2" data-testid="machine-spec-sheet">
    <div className="relative spotlight aspect-square overflow-hidden">
      <div className="absolute inset-0 blueprint opacity-60" />
      <div className="absolute left-1/2 top-6 bottom-6 w-px bg-steel/15" />
      <div className="absolute top-1/2 left-6 right-6 h-px bg-steel/15" />
      <motion.img
        key={m.id}
        src={m.img}
        alt={`${t.machines.alt} ${m.id}`}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative w-full h-full object-contain p-6 drop-shadow-[0_30px_30px_rgba(13,20,32,0.25)]"
      />
      <span className="absolute top-4 left-4 font-mono text-[11px] tracking-[0.16em] uppercase text-slate-600">Fig. 0{i + 2} — {m.id}</span>
    </div>
    <div className="p-6 md:p-8 flex flex-col">
      <div className="eyebrow">{t.machines.sheet}</div>
      <motion.h3 key={m.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="font-display font-extrabold text-5xl md:text-6xl text-ink mt-2" data-testid="machine-spec-name">
        {m.id}
      </motion.h3>
      <dl className="mt-6 space-y-3 flex-1">
        {SPEC_KEYS.map((k) => (
          <div key={k} className="flex items-end text-sm">
            <dt className="text-slate-600 shrink-0">{t.machines.rows[k]}</dt>
            <span className="leader" />
            <dd className="font-mono font-medium text-ink text-right" data-testid={`machine-spec-${k}`}>{specValue(m, k, t)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          data-testid="machine-request-info-btn"
          onClick={() => requestMachine(m.id)}
          className="group inline-flex items-center gap-2 bg-steel text-white font-semibold px-5 py-3 rounded-full hover:bg-ink transition-colors"
        >
          {t.machines.info} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
        <button
          data-testid="machine-compare-btn"
          onClick={() => scrollToId("comparatif")}
          className="inline-flex items-center gap-2 border border-line font-semibold px-5 py-3 rounded-full hover:border-ink transition-colors"
        >
          <Scale className="w-4 h-4" /> {t.machines.compare}
        </button>
        <PdfButton
          machine={m}
          testId="machine-pdf-btn"
          className="inline-flex items-center gap-2 border border-line font-semibold px-5 py-3 rounded-full hover:border-ink disabled:opacity-60 transition-colors"
        />
      </div>
    </div>
  </div>
);

export const Machines = () => {
  const [active, setActive] = useState(2);
  const { t } = useLang();
  const c = t.machines;
  return (
    <section id="machines" data-testid="machines-section" className="py-20 md:py-32 bg-white border-y border-line">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <SectionHead index="02" label={c.label} lines={c.lines}>
          {c.text}
        </SectionHead>
        <FadeUp className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3"><ModelList active={active} setActive={setActive} t={t} /></div>
          <div className="lg:col-span-9"><SpecSheet m={MACHINES[active]} i={active} t={t} /></div>
        </FadeUp>
      </div>
    </section>
  );
};
