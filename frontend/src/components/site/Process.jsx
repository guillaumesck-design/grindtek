import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHead, FadeUp } from "./Reveal";
import { useLang } from "@/i18n";

export const Process = () => {
  const { t } = useLang();
  const c = t.process;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section id="processus" data-testid="process-section" className="py-20 md:py-32 bg-white border-y border-line">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <SectionHead index="12" label={c.label} lines={c.lines} />
        <div ref={ref} className="relative">
          <div className="hidden lg:block absolute top-[22px] left-0 right-0 h-px bg-line" />
          <motion.div style={{ scaleX: scale }} className="hidden lg:block absolute top-[22px] left-0 right-0 h-[2px] bg-steel origin-left" />
          <div className="lg:hidden absolute top-0 bottom-0 left-[22px] w-px bg-line" />
          <motion.div style={{ scaleY: scale }} className="lg:hidden absolute top-0 bottom-0 left-[22px] w-[2px] bg-steel origin-top" />
          <ol className="grid lg:grid-cols-5 gap-10 lg:gap-6">
            {c.steps.map((s, i) => (
              <FadeUp key={i} delay={i * 0.1} className="relative pl-16 lg:pl-0" data-testid={`process-step-${i}`}>
                <div className="absolute left-0 top-0 lg:static w-11 h-11 rounded-full bg-white border-2 border-steel grid place-items-center font-mono text-sm font-medium text-steel">
                  0{i + 1}
                </div>
                <h3 className="font-display font-bold text-xl text-ink lg:mt-8">{s.t}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed text-[15px]">{s.d}</p>
              </FadeUp>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
