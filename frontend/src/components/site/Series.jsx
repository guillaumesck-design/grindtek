import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MaskLines, FadeUp, EASE } from "./Reveal";
import { SERIES_KEYS } from "@/data/content";
import { scrollToId } from "@/lib/api";
import { useLang } from "@/i18n";

export const Series = () => {
  const [a, setA] = useState(1);
  const { t } = useLang();
  const c = t.series;
  const s = { k: SERIES_KEYS[a], ...c.items[a] };
  return (
    <section id="series" data-testid="series-section" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <span className="eyebrow"><span className="text-gold">09</span> — {c.label}</span>
          <MaskLines className="mt-5 font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.02] text-ink" lines={c.lines} />
          <FadeUp delay={0.1} className="mt-8">
            <div className="text-slate-600 mb-4">{c.intro}</div>
            <div className="inline-flex flex-wrap gap-1 p-1 bg-white border border-line rounded-full">
              {c.items.map((x, i) => (
                <button
                  key={SERIES_KEYS[i]}
                  data-testid={`series-tab-${SERIES_KEYS[i]}`}
                  onClick={() => setA(i)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${a === i ? "text-white" : "text-slate-700 hover:text-ink"}`}
                >
                  {a === i && <motion.span layoutId="series-pill" className="absolute inset-0 bg-ink rounded-full" transition={{ duration: 0.45, ease: EASE }} />}
                  <span className="relative">{x.t}</span>
                </button>
              ))}
            </div>
            <motion.p key={s.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-6 text-lg text-ink leading-relaxed max-w-lg" data-testid="series-description">
              {s.d}
            </motion.p>
            <button
              data-testid="series-specialist-btn"
              onClick={() => scrollToId("contact")}
              className="group mt-8 inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3.5 rounded-full hover:bg-ink transition-colors"
            >
              {c.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </FadeUp>
        </div>
        <FadeUp delay={0.15} className="lg:col-span-6">
          <div className="relative spotlight aspect-square max-w-[560px] mx-auto rounded-full overflow-hidden border border-line">
            <motion.div className="absolute inset-6 rounded-full border border-dashed border-steel/30" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
            <img src="/img/cnc.png" alt={c.alt} className="relative w-full h-full object-contain p-12" />
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
