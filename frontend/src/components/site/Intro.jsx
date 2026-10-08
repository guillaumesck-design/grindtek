import { ArrowRight } from "lucide-react";
import { MaskLines, FadeUp } from "./Reveal";
import { scrollToId } from "@/lib/api";
import { useLang } from "@/i18n";

const KEYS = ["fonte", "acier", "aluminium", "autres"];

export const Intro = () => {
  const { t } = useLang();
  const c = t.intro;
  return (
  <section id="solutions" data-testid="intro-section" className="py-20 md:py-32">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-3"><span className="eyebrow"><span className="text-gold">01</span> — {c.label}</span></div>
      <div className="lg:col-span-9">
        <MaskLines
          className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.4rem] leading-[1.02] text-ink"
          lines={c.lines}
        />
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-start">
          <FadeUp className="text-lg text-slate-600 leading-relaxed">
            {c.text}
            <div className="mt-6">
              <button
                data-testid="intro-eval-btn"
                onClick={() => scrollToId("contact")}
                className="group inline-flex items-center gap-2 font-semibold text-steel border-b-2 border-gold pb-1 hover:text-ink transition-colors"
              >
                {c.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="border border-line bg-white p-6 relative tick">
            <div className="eyebrow mb-4">{c.apps}</div>
            <div className="flex flex-wrap gap-2">
              {c.list.map((a, i) => (
                <button
                  key={KEYS[i]}
                  data-testid={`intro-material-${KEYS[i]}`}
                  onClick={() => scrollToId("contact")}
                  className="px-4 py-2 rounded-full border border-line bg-paper text-sm font-medium hover:bg-ink hover:text-white hover:border-ink transition-colors"
                >
                  {a}
                </button>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  </section>
  );
};
