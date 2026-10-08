import { MapPin, Phone } from "lucide-react";
import { SectionHead, FadeUp } from "./Reveal";
import { CITIES, LEFT_CITIES, BRAND } from "@/data/content";
import { useLang } from "@/i18n";

const C = 260;
const R = 235;
const KM = 1600;
const BASE = [3.32, 49.52];

const project = (lon, lat) => {
  const dx = (lon - BASE[0]) * Math.cos((BASE[1] * Math.PI) / 180) * 111.32;
  const dy = (lat - BASE[1]) * 110.57;
  return [C + (dx / KM) * R, C - (dy / KM) * R];
};

const Radar = ({ names }) => (
  <svg viewBox="0 0 520 520" className="w-full h-auto" data-testid="europe-radar">
    <defs>
      <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4a729c" stopOpacity="0" />
        <stop offset="1" stopColor="#4a729c" stopOpacity="0.35" />
      </linearGradient>
    </defs>
    {[500, 1000, 1500].map((km) => (
      <g key={km}>
        <circle cx={C} cy={C} r={(km / KM) * R} fill="none" stroke="#b8c3cf" strokeDasharray="3 5" />
        <text x={C + 6} y={C - (km / KM) * R - 6} fontSize="10" fontFamily="JetBrains Mono" fill="#3b4a5c">{`${km} km`}</text>
      </g>
    ))}
    <line x1={C} y1={C - R} x2={C} y2={C + R} stroke="#dce2e9" />
    <line x1={C - R} y1={C} x2={C + R} y2={C} stroke="#dce2e9" />
    <g className="radar-sweep">
      <path d={`M${C} ${C} L${C + R} ${C} A${R} ${R} 0 0 0 ${C + R * Math.cos(Math.PI / 5)} ${C - R * Math.sin(Math.PI / 5)} Z`} fill="url(#sweep)" />
    </g>
    {CITIES.map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      const left = LEFT_CITIES.includes(i);
      const n = names[i];
      return (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill="#2b4c6f" />
          <text x={left ? x - 7 : x + 7} y={y + 3.5} textAnchor={left ? "end" : "start"} fontSize="11" fontFamily="Archivo" fontWeight="600" fill="#0d1420">{n}</text>
        </g>
      );
    })}
    <circle cx={C} cy={C} r="8" fill="#c5b358" className="pulse-ring" />
    <circle cx={C} cy={C} r="7" fill="#c5b358" stroke="#0d1420" strokeWidth="2" />
  </svg>
);

export const Europe = () => {
  const { t } = useLang();
  const c = t.europe;
  return (
  <section id="europe" data-testid="europe-section" className="py-20 md:py-32 overflow-hidden">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10">
      <SectionHead index="13" label={c.label} lines={c.lines} />
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <FadeUp className="lg:col-span-5 space-y-6">
          <p className="text-lg text-slate-600 leading-relaxed">
            {c.text}
          </p>
          <div className="border border-line bg-white p-6 relative tick space-y-4" data-testid="europe-base-card">
            <div className="eyebrow">{c.base}</div>
            <div className="flex gap-3"><MapPin className="w-5 h-5 text-steel shrink-0 mt-0.5" /><span className="text-ink">{BRAND.address}</span></div>
            <a href={BRAND.phoneHref} data-testid="europe-phone-link" className="flex gap-3 hover:text-steel transition-colors"><Phone className="w-5 h-5 text-steel shrink-0 mt-0.5" /><span className="font-mono">{BRAND.phone}</span></a>
          </div>
          <p className="text-sm text-slate-600">{c.note}</p>
        </FadeUp>
        <FadeUp delay={0.15} className="lg:col-span-7">
          <div className="relative spotlight border border-line p-4 md:p-8">
            <span className="absolute top-4 left-4 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-600">{c.fig}</span>
            <Radar names={c.cities} />
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
  );
};
