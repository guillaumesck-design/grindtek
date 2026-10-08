import { motion } from "framer-motion";
import { MousePointerClick, Timer, Box, Cog, ScanLine, Disc3, ArrowRight } from "lucide-react";
import { SectionHead, FadeUp, EASE } from "./Reveal";
import { DIFFS } from "@/data/content";
import { scrollToId } from "@/lib/api";

const ICONS = { prog: MousePointerClick, setup: Timer, fixture: Box, pre: Cog, laser: ScanLine, disc: Disc3 };
const SPAN = { prog: "md:col-span-2", disc: "md:col-span-2 lg:col-span-3" };
const PTS = [[40, 120], [90, 60], [170, 48], [240, 80], [280, 140], [230, 190], [140, 200], [70, 175]];

const PointPath = () => (
  <svg viewBox="0 0 320 240" className="w-full h-full">
    <path d="M40 120 Q60 40 170 44 Q290 50 284 140 Q276 210 140 204 Q50 200 40 120Z" fill="#eef2f6" stroke="#b8c3cf" strokeDasharray="4 4" />
    <motion.polyline
      points={[...PTS, PTS[0]].map((p) => p.join(",")).join(" ")}
      fill="none" stroke="#2b4c6f" strokeWidth="2"
      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 2.2, ease: EASE }}
    />
    {PTS.map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="6" fill="#c5b358" />
        <text x={x + 9} y={y - 8} fontSize="10" fontFamily="JetBrains Mono" fill="#3b4a5c">{`P${i + 1}`}</text>
      </g>
    ))}
  </svg>
);

const Card = ({ d, i }) => {
  const Icon = ICONS[d.k];
  const dark = d.k === "setup";
  return (
    <FadeUp delay={(i % 3) * 0.08} className={`${SPAN[d.k] || ""} h-full`}>
      <div data-testid={`diff-card-${d.k}`} className={`group h-full flex flex-col p-6 md:p-8 border transition-colors duration-300 relative overflow-hidden ${dark ? "bg-ink text-white border-ink" : "bg-white border-line hover:border-steel-2"}`}>
        <div className="flex items-center justify-between">
          <Icon className={`w-6 h-6 ${dark ? "text-gold" : "text-steel"}`} />
          <span className={`font-mono text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>0{i + 1}</span>
        </div>
        {d.k === "prog" && <div className="my-6 h-44 md:h-52"><PointPath /></div>}
        {d.k === "setup" && <div className="my-6 font-display font-extrabold text-6xl md:text-7xl leading-none">&lt;15<span className="text-gold text-3xl md:text-4xl"> min</span></div>}
        {d.k === "laser" && (
          <div className="relative my-6 h-20 bg-paper overflow-hidden">
            <motion.div className="absolute inset-y-0 w-1 bg-[#bf0000] shadow-[0_0_18px_#bf0000]" animate={{ left: ["4%", "94%", "4%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
            <div className="absolute inset-x-4 top-1/2 h-8 -translate-y-1/2 border border-dashed border-slate-400" />
          </div>
        )}
        <div className={d.k === "disc" ? "grid md:grid-cols-2 gap-6 items-center flex-1" : "mt-auto"}>
          <div className={d.k === "disc" ? "" : "pt-6"}>
            <h3 className="font-display font-bold text-xl md:text-2xl">{d.t}</h3>
            <p className={`mt-3 leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{d.d}</p>
          </div>
          {d.k === "disc" && (
            <div className="spotlight h-56 md:h-64 overflow-hidden">
              <img src="/img/cnc.png" alt="Machine CNC à disques diamantés" className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105" />
            </div>
          )}
        </div>
      </div>
    </FadeUp>
  );
};

export const Bento = () => (
  <section id="atouts" data-testid="bento-section" className="py-20 md:py-32">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10">
      <SectionHead index="07" label="Différenciateurs" lines={["Ce qui fait la différence,", "jour après jour."]} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DIFFS.map((d, i) => <Card key={d.k} d={d} i={i} />)}
      </div>
      <FadeUp className="mt-10">
        <button
          data-testid="bento-eval-btn"
          onClick={() => scrollToId("contact")}
          className="group inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3.5 rounded-full hover:bg-ink transition-colors"
        >
          Demander une évaluation technique <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </FadeUp>
    </div>
  </section>
);
