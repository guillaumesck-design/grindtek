import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MaskLines, FadeUp } from "./Reveal";
import { scrollToId } from "@/lib/api";

export const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <section ref={ref} id="a-propos" data-testid="about-section" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <FadeUp className="lg:col-span-6">
          <div className="relative clip-corner aspect-[4/3] overflow-hidden bg-ink">
            <motion.img style={{ y, scale: 1.18 }} src="/img/sede.webp" alt="Site du partenaire AW Auto Grinding" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
              Fig. 07 — Site partenaire
            </div>
          </div>
        </FadeUp>
        <div className="lg:col-span-6">
          <span className="eyebrow"><span className="text-gold">05</span> — À propos</span>
          <MaskLines className="mt-5 font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.02] text-ink" lines={["À propos", "d'OW Auto Grinding"]} />
          <FadeUp delay={0.15} className="mt-8 space-y-5 text-slate-600 text-[17px] leading-relaxed">
            <p>OW Auto Grinding apporte des solutions CNC d'ébavurage automatisé, avec un objectif clair : augmenter la productivité des fonderies et réduire les coûts du poste de parachèvement.</p>
            <p>Nous accompagnons la modernisation des process de production, en réduisant la dépendance à la main-d'œuvre manuelle et en renforçant la compétitivité des fonderies européennes.</p>
            <p>En partenariat avec <strong className="text-ink">Weijing</strong>, fabricant international de référence, nous mettons à disposition en Europe des machines CNC 5 axes développées spécifiquement pour les applications de fonderie.</p>
          </FadeUp>
          <FadeUp delay={0.25} className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 border border-line bg-white px-4 py-3" data-testid="about-partner-badge">
              <span className="font-display font-extrabold">OW</span>
              <span className="text-gold font-mono">×</span>
              <span className="font-display font-extrabold">WEIJING</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-600 ml-2">Distribution Europe</span>
            </div>
            <button
              data-testid="about-quote-btn"
              onClick={() => scrollToId("contact")}
              className="group inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3.5 rounded-full hover:bg-ink transition-colors"
            >
              Demander un devis <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};
