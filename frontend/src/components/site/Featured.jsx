import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FadeUp, MaskLines } from "./Reveal";
import { requestMachine } from "@/lib/api";
import { MACHINES } from "@/data/content";
import { PdfButton } from "./PdfButton";

const FIGS = [
  ["500 × 300 mm", "Diamètre × hauteur"],
  ["40 kg", "Pièce + fixture"],
  ["7,5 + 3,5 kW", "Puissance disques 1 + 2"],
  ["Double palette", "Type de chargement"],
];

export const Featured = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rot = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  return (
    <section ref={ref} id="gv230" data-testid="featured-section" className="relative overflow-hidden spotlight-dark text-white py-20 md:py-32">
      <div className="absolute inset-0 blueprint-dark" />
      <div className="relative mx-auto max-w-[1360px] px-5 md:px-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <span className="eyebrow !text-gold">Machine phare</span>
          <MaskLines
            className="font-display font-extrabold leading-[0.88] mt-4 text-[5rem] sm:text-[8rem] lg:text-[10rem]"
            lines={["GV", <span className="text-gold">230</span>]}
          />
          <FadeUp delay={0.2} className="mt-6 text-slate-300 text-lg max-w-md">
            Double palette, deux disques et une capacité de 500 × 300 mm : le modèle mis en avant de notre gamme.
          </FadeUp>
          <div className="mt-10 grid grid-cols-2 gap-px bg-white/10 border border-white/10">
            {FIGS.map(([v, l], i) => (
              <FadeUp key={l} delay={0.1 * i} className="bg-ink/60 p-5" data-testid={`featured-fig-${i}`}>
                <div className="font-display font-bold text-xl md:text-2xl">{v}</div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300 mt-1">{l}</div>
              </FadeUp>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
          <button
            data-testid="featured-quote-btn"
            onClick={() => requestMachine("GV 230")}
            className="group inline-flex items-center gap-2 bg-gold text-ink font-semibold px-6 py-3.5 rounded-full hover:bg-white transition-colors"
          >
            Demander un devis <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <PdfButton
            machine={MACHINES.find((x) => x.id === "GV 230")}
            testId="featured-pdf-btn"
            className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-full hover:border-gold hover:text-gold disabled:opacity-60 transition-colors"
          />
          </div>
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2 relative">
          <div className="absolute inset-[8%] rounded-full border border-dashed border-gold/40" />
          <div className="absolute inset-[18%] rounded-full bg-steel-2/30 blur-3xl" />
          <motion.img
            style={{ y, rotate: rot }}
            src="/img/gv230.png"
            alt="Machine CNC d'ébavurage GV 230"
            className="relative w-full max-w-[560px] mx-auto drop-shadow-[0_40px_50px_rgba(0,0,0,0.55)]"
          />
        </div>
      </div>
    </section>
  );
};
