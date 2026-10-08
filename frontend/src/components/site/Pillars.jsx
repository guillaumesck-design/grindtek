import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHead, FadeUp, EASE } from "./Reveal";
import { scrollToId } from "@/lib/api";
import { useLang } from "@/i18n";

export const Pillars = () => {
  const { t } = useLang();
  const c = t.pillars;
  return (
  <section id="piliers" data-testid="pillars-section" className="py-20 md:py-32 bg-white border-y border-line">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10">
      <SectionHead index="04" label={c.label} lines={c.lines} />
      <div className="grid md:grid-cols-3 gap-10 md:gap-8">
        {c.items.map((p, i) => (
          <FadeUp key={i} delay={i * 0.12} data-testid={`pillar-${i}`}>
            <motion.div
              className="h-[2px] bg-gold origin-left mb-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.12 }}
            />
            <div className="font-display font-extrabold text-6xl text-outline leading-none">0{i + 1}</div>
            <h3 className="font-display font-bold text-2xl text-ink mt-6">{p.t}</h3>
            <p className="mt-3 text-slate-600 leading-relaxed">{p.d}</p>
          </FadeUp>
        ))}
      </div>
      <FadeUp className="mt-12">
        <button
          data-testid="pillars-eval-btn"
          onClick={() => scrollToId("contact")}
          className="group inline-flex items-center gap-2 font-semibold text-steel border-b-2 border-gold pb-1 hover:text-ink transition-colors"
        >
          {c.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </FadeUp>
    </div>
  </section>
  );
};
