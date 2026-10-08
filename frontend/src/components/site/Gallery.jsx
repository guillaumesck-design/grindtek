import { GALLERY } from "@/data/content";
import { FadeUp } from "./Reveal";

export const Gallery = () => (
  <section id="atelier" data-testid="gallery-section" className="py-16 md:py-24 bg-ink text-white overflow-hidden">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10 flex flex-wrap items-end justify-between gap-4 mb-10">
      <FadeUp>
        <span className="eyebrow !text-slate-300"><span className="text-gold">08</span> — Sur le terrain</span>
        <h2 className="font-display font-bold text-3xl md:text-5xl mt-4">Livraisons, installations, showroom.</h2>
      </FadeUp>
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-slate-300">Survolez pour mettre en pause</span>
    </div>
    <div className="gallery-track flex gap-4 md:gap-6 pl-5" data-testid="gallery-track">
      {[...GALLERY, ...GALLERY].map((src, i) => (
        <figure key={i} className="relative shrink-0 w-[68vw] sm:w-[300px] md:w-[340px] aspect-[4/5] overflow-hidden group">
          <img src={src} alt={`Photo terrain ${(i % GALLERY.length) + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <figcaption className="absolute top-3 left-3 font-mono text-[11px] tracking-[0.14em] bg-ink/70 px-2 py-1">
            IMG {String((i % GALLERY.length) + 1).padStart(2, "0")}
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);
