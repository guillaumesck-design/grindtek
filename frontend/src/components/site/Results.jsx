import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SectionHead, FadeUp, Counter, EASE } from "./Reveal";
import { BENEFITS } from "@/data/content";
import { scrollToId } from "@/lib/api";

const Bar = ({ label, value, pct, strong }) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="font-mono uppercase tracking-[0.12em] text-xs text-slate-600">{label}</span>
      <span className="font-mono font-medium text-ink">{value}</span>
    </div>
    <div className="h-3 bg-paper overflow-hidden">
      <motion.div
        className={`h-full origin-left ${strong ? "bg-steel" : "bg-slate-400"}`}
        style={{ width: `${pct}%` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.4, ease: EASE, delay: strong ? 0.3 : 0 }}
      />
    </div>
  </div>
);

export const Results = () => (
  <section id="resultats" data-testid="results-section" className="py-20 md:py-32">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10">
      <SectionHead index="03" label="Résultats" lines={["Une efficacité et une", "productivité prouvées."]} />
      <div className="grid lg:grid-cols-12 gap-5">
        <FadeUp className="lg:col-span-7 bg-white border border-line p-6 md:p-10 relative tick" data-testid="results-productivity">
          <div className="eyebrow">Productivité</div>
          <div className="flex flex-wrap items-end gap-4 mt-4">
            <Counter to={116} prefix="+" suffix=" %" className="font-display font-extrabold text-6xl md:text-8xl text-ink leading-none" testId="results-productivity-value" />
            <span className="font-mono text-sm text-slate-600 pb-2">pièces / heure</span>
          </div>
          <div className="mt-10 space-y-6">
            <Bar label="Avant" value="1 opérateur · 60 pièces/h" pct={46} />
            <Bar label="Après" value="1 opérateur · 130 pièces/h" pct={100} strong />
          </div>
        </FadeUp>
        <FadeUp delay={0.1} className="lg:col-span-5 bg-ink text-white p-6 md:p-10 flex flex-col" data-testid="results-scrap">
          <div className="eyebrow !text-slate-300">Rebut en finition</div>
          <div className="mt-4 font-display font-extrabold text-7xl md:text-8xl leading-none">
            0<span className="text-gold"> %</span>
          </div>
          <div className="mt-3 font-mono text-sm text-slate-300">de perte — Zéro rebut</div>
          <div className="mt-auto pt-10 grid grid-cols-2 gap-4 border-t border-white/15">
            <div className="pt-4">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-slate-300">Avant</div>
              <div className="font-display text-2xl font-bold line-through decoration-gold/80">3 %</div>
            </div>
            <div className="pt-4">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-slate-300">Après</div>
              <div className="font-display text-2xl font-bold">0 %</div>
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={0.15} className="lg:col-span-12 bg-white border border-line p-6 md:p-10" data-testid="results-benefits">
          <div className="eyebrow mb-6">Autres bénéfices</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div key={b} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-steel shrink-0 mt-0.5" />
                <p className="text-slate-700 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
      <FadeUp className="mt-10">
        <button
          data-testid="results-eval-btn"
          onClick={() => scrollToId("contact")}
          className="group inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3.5 rounded-full hover:bg-ink transition-colors"
        >
          Demander une évaluation technique <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </FadeUp>
    </div>
  </section>
);
