import { ArrowRight } from "lucide-react";
import { MaskLines, FadeUp } from "./Reveal";
import { scrollToId } from "@/lib/api";
import { useLang } from "@/i18n";

export const About = () => {
  const { t } = useLang();
  const c = t.about;
  return (
    <section id="a-propos" data-testid="about-section" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10 grid lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-4">
          <span className="eyebrow"><span className="text-gold">05</span> — {c.label}</span>
          <MaskLines className="mt-5 font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.02] text-ink" lines={c.lines} />
        </div>
        <div className="lg:col-span-8 lg:pt-10">
          <FadeUp delay={0.15} className="space-y-5 text-slate-600 text-[17px] leading-relaxed max-w-3xl">
            <p>{c.p1}</p>
            <p>{c.p2}</p>
            <p>{c.p3a} <strong className="text-ink">Weijing</strong>{c.p3b}</p>
          </FadeUp>
          <FadeUp delay={0.25} className="mt-8 flex flex-wrap items-center gap-4">
            <button
              data-testid="about-quote-btn"
              onClick={() => scrollToId("contact")}
              className="group inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3.5 rounded-full hover:bg-ink transition-colors"
            >
              {c.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};
