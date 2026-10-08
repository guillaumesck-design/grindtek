import { ArrowRight } from "lucide-react";
import { MaskLines, FadeUp } from "./Reveal";
import { scrollToId } from "@/lib/api";

const APPS = ["Fonte", "Acier", "Aluminium", "Autres matériaux de fonderie"];

export const Intro = () => (
  <section id="solutions" data-testid="intro-section" className="py-20 md:py-32">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-3"><span className="eyebrow"><span className="text-gold">01</span> — Solutions</span></div>
      <div className="lg:col-span-9">
        <MaskLines
          className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.4rem] leading-[1.02] text-ink"
          lines={["Des solutions CNC pour", "l'ébavurage automatisé de", "vos pièces de fonderie."]}
        />
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-start">
          <FadeUp className="text-lg text-slate-600 leading-relaxed">
            OW Auto Grinding propose des machines CNC 5 axes spécialisées dans l'ébavurage automatisé des pièces brutes de fonderie.
            <div className="mt-6">
              <button
                data-testid="intro-eval-btn"
                onClick={() => scrollToId("contact")}
                className="group inline-flex items-center gap-2 font-semibold text-steel border-b-2 border-gold pb-1 hover:text-ink transition-colors"
              >
                Demander une évaluation <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="border border-line bg-white p-6 relative tick">
            <div className="eyebrow mb-4">Applications traitées</div>
            <div className="flex flex-wrap gap-2">
              {APPS.map((a) => (
                <button
                  key={a}
                  data-testid={`intro-material-${a.split(" ")[0].toLowerCase()}`}
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
