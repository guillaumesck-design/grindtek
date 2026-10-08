import { Check, Minus } from "lucide-react";
import { SectionHead, FadeUp } from "./Reveal";
import { COMPARE } from "@/data/content";

export const Comparison = () => (
  <section id="comparatif" data-testid="comparison-section" className="py-20 md:py-32 bg-white border-y border-line">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10">
      <SectionHead index="10" label="Comparatif" lines={["Notre CNC, une cellule", "robotisée ou l'ébavurage", "manuel ?"]}>
        Trois approches du parachèvement, comparées critère par critère.
      </SectionHead>
      <FadeUp>
        <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0" data-lenis-prevent-wheel>
          <table className="w-full min-w-[760px] border-collapse text-left" data-testid="comparison-table">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white w-[22%] py-4 pr-4 align-bottom font-mono text-xs uppercase tracking-[0.14em] text-slate-600 font-normal">Critère</th>
                {COMPARE.cols.map((c, i) => (
                  <th key={c} className={`w-[26%] p-5 align-bottom ${i === 0 ? "bg-ink text-white" : "bg-paper text-ink"}`}>
                    {i === 0 && <span className="inline-block mb-2 font-mono text-[10px] uppercase tracking-widest bg-gold text-ink px-2 py-0.5">Recommandé</span>}
                    <div className="font-display font-bold text-lg leading-tight">{c}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.rows.map(([crit, ...vals], r) => (
                <tr key={crit} className="group" data-testid={`comparison-row-${r}`}>
                  <td className="sticky left-0 z-10 bg-white py-4 pr-4 border-b border-line font-semibold text-sm text-ink">{crit}</td>
                  {vals.map((v, i) => (
                    <td key={i} className={`p-5 border-b text-sm leading-snug transition-colors ${i === 0 ? "bg-ink text-white border-white/10" : "border-line text-slate-700 group-hover:bg-paper"}`}>
                      <span className="flex gap-2">
                        {i === 0 ? <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" /> : <Minus className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                        {v}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-slate-600 max-w-3xl">
          Les valeurs chiffrées proviennent de notre cas de référence (60 → 130 pièces/h, 3 % → 0 % de rebut). Les autres éléments décrivent des tendances générales, à valider pour vos pièces lors de l'évaluation technique.
        </p>
      </FadeUp>
    </div>
  </section>
);
