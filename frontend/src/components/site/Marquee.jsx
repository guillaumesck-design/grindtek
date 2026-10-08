import { useLang } from "@/i18n";

export const Marquee = () => {
  const { t } = useLang();
  return (
  <div data-testid="marquee" className="relative overflow-hidden border-y border-line bg-white py-6 md:py-8 select-none" aria-hidden="true">
    <div className="marquee-track flex items-center">
      {[...t.marquee, ...t.marquee].map((w, i) => (
        <span key={i} className="flex items-center">
          <span className={`font-display font-bold text-4xl md:text-7xl whitespace-nowrap px-6 md:px-10 ${i % 2 ? "text-outline" : "text-ink"}`}>
            {w}
          </span>
          <span className="w-3 h-3 md:w-4 md:h-4 rotate-45 bg-gold shrink-0" />
        </span>
      ))}
    </div>
  </div>
  );
};
