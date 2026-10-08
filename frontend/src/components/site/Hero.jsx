import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { MaskLines, FadeUp, EASE } from "./Reveal";
import { scrollToId } from "@/lib/api";

const HeroStat = ({ big, label, testId }) => (
  <div data-testid={testId} className="bg-white/85 backdrop-blur-md px-3 py-2.5 md:px-5 md:py-4 min-w-0 sm:min-w-[140px] tick relative">
    <div className="font-display font-extrabold text-lg sm:text-2xl md:text-4xl text-ink leading-none whitespace-nowrap">{big}</div>
    <div className="font-mono text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.14em] text-slate-600 mt-1.5">{label}</div>
  </div>
);

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.16]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 70, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 70, damping: 18 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section ref={ref} id="top" data-testid="hero-section" className="relative overflow-hidden blueprint pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 mb-10 md:mb-14"
        >
          <span className="eyebrow"><span className="text-gold">●</span> Réf. OW—GV · Ébavurage CNC 5 axes</span>
          <span className="eyebrow hidden sm:inline">Fonte · Acier · Aluminium</span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <MaskLines
            as="h1"
            onLoad
            delay={0.1}
            testId="hero-title"
            className="lg:col-span-8 font-display font-extrabold text-ink text-[2.6rem] leading-[0.96] sm:text-6xl lg:text-7xl xl:text-[5.4rem]"
            lines={[
              "Machines",
              "d'ébavurage pour",
              <>pièces de <span className="text-steel">fonderie</span><span className="text-gold">.</span></>,
            ]}
          />
          <FadeUp delay={0.55} className="lg:col-span-4 lg:pb-3">
            <p className="text-lg md:text-xl text-ink font-medium leading-snug">
              Supprimez l'ébavurage manuel, réduisez vos coûts et standardisez la finition.
            </p>
            <ul className="mt-5 space-y-2.5 text-slate-600 text-[15px]">
              <li className="flex gap-2.5"><Check className="w-4 h-4 mt-1 text-steel shrink-0" />Pour pièces de fonderie en acier, fonte, aluminium et autres alliages.</li>
              <li className="flex gap-2.5"><Check className="w-4 h-4 mt-1 text-steel shrink-0" />Une alternative technique aux cellules robotisées traditionnelles.</li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                data-testid="hero-quote-btn"
                onClick={() => scrollToId("contact")}
                className="group inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3.5 rounded-full hover:bg-ink transition-colors"
              >
                Demander un devis
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                data-testid="hero-machines-btn"
                onClick={() => scrollToId("machines")}
                className="inline-flex items-center gap-2 border border-ink/20 bg-white/60 font-semibold px-6 py-3.5 rounded-full hover:border-ink transition-colors"
              >
                Voir la gamme GV
              </button>
            </div>
          </FadeUp>
        </div>

        <div className="mt-12 md:mt-16 [perspective:1800px]" onMouseMove={onMove} onMouseLeave={onLeave}>
          <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative clip-corner aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] bg-ink" data-testid="hero-frame">
            <motion.picture style={{ y: imgY, scale: imgScale }} className="absolute inset-0 block">
              <source media="(max-width: 639px)" srcSet="/img/hero-mobile.webp" />
              <img src="/img/hero.webp" alt="Gamme de machines CNC d'ébavurage GV en showroom" className="w-full h-full object-cover" />
            </motion.picture>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />
            <motion.div
              className="absolute inset-0 bg-paper origin-top"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.45 }}
            />
            <div className="absolute top-4 left-4 md:top-6 md:left-7 font-mono text-[11px] tracking-[0.18em] uppercase text-white/90">
              Fig. 01 — Gamme GV 120 → GV 2100
            </div>
            <div className="absolute bottom-4 left-4 right-4 md:bottom-7 md:left-7 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <HeroStat testId="hero-stat-productivity" big="+116 %" label="pièces / heure" />
              <HeroStat testId="hero-stat-scrap" big="0 %" label="rebut en finition" />
              <HeroStat testId="hero-stat-setup" big="< 15 min" label="changement de série" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
