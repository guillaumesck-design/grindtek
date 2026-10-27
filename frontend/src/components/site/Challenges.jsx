import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionHead, FadeUp } from "./Reveal";
import { scrollToId } from "@/lib/api";
import { useLang } from "@/i18n";

export const Challenges = () => {
  const { t } = useLang();
  const c = t.challenges;
  return (
  <section id="defis" data-testid="challenges-section" className="py-20 md:py-32 bg-white border-y border-line">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10">
      <SectionHead index="10" label={c.label} lines={c.lines} />
      <div className="border-t border-line">
        {c.items.map((x, i) => (
          <FadeUp key={i} delay={i * 0.05} y={16}>
            <button
              data-testid={`challenge-row-${i}`}
              onClick={() => scrollToId("contact")}
              className="group relative w-full flex items-center gap-4 md:gap-8 py-6 md:py-8 border-b border-line text-left overflow-hidden"
            >
              <span className="absolute inset-0 bg-ink origin-bottom scale-y-0 transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
              <span className="relative font-mono text-sm text-slate-500 group-hover:text-gold transition-colors w-10 md:pl-4">0{i + 1}</span>
              <span className="relative flex-1 font-display font-semibold text-xl sm:text-2xl md:text-4xl text-ink group-hover:text-white transition-colors">{x}</span>
              <span className="relative hidden sm:inline font-mono text-xs uppercase tracking-[0.14em] text-slate-600 group-hover:text-slate-300 transition-colors">
                {c.see}
              </span>
              <ArrowUpRight className="relative w-6 h-6 md:mr-4 text-steel group-hover:text-gold group-hover:rotate-45 transition-[transform,color] duration-300" />
            </button>
          </FadeUp>
        ))}
      </div>
      <FadeUp className="mt-10">
        <button
          data-testid="challenges-contact-btn"
          onClick={() => scrollToId("contact")}
          className="group inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3.5 rounded-full hover:bg-ink transition-colors"
        >
          {c.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </FadeUp>
    </div>
  </section>
  );
};
