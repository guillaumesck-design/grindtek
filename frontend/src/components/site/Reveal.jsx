import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export const FadeUp = ({ children, delay = 0, className = "", y = 28, ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.8, ease: EASE, delay }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const MaskLines = ({ lines, as = "h2", className = "", onLoad = false, delay = 0, testId }) => {
  const Tag = motion[as];
  const trigger = onLoad ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.15 } };
  return (
    <Tag
      data-testid={testId}
      className={className}
      initial="hide"
      {...trigger}
      variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: delay } } }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className="block"
            variants={{ hide: { y: "110%" }, show: { y: "0%", transition: { duration: 1.05, ease: EASE } } }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export const Counter = ({ to, decimals = 0, prefix = "", suffix = "", className = "", testId }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView) return undefined;
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (x) => setV(x) });
    return () => c.stop();
  }, [inView, to]);
  const txt = v.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} className={className} data-testid={testId}>
      {prefix}{txt}{suffix}
    </span>
  );
};

export const SectionHead = ({ index, label, lines, children, dark = false, className = "" }) => (
  <div className={`grid lg:grid-cols-12 gap-6 lg:gap-10 mb-12 md:mb-16 ${className}`}>
    <div className="lg:col-span-3">
      <span className={`eyebrow ${dark ? "!text-slate-300" : ""}`}>
        <span className="text-gold">{index}</span> — {label}
      </span>
    </div>
    <div className="lg:col-span-9">
      <MaskLines
        lines={lines}
        className={`font-display font-bold text-3xl sm:text-4xl lg:text-[3.4rem] leading-[1.02] ${dark ? "text-white" : "text-ink"}`}
      />
      {children && (
        <FadeUp delay={0.2} className={`mt-6 max-w-2xl text-base md:text-lg leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
          {children}
        </FadeUp>
      )}
    </div>
  </div>
);
