import { MapPin, Phone, Mail } from "lucide-react";
import { MaskLines, FadeUp } from "./Reveal";
import { QuoteForm } from "./QuoteForm";
import { BRAND } from "@/data/content";

export const Contact = ({ onLegal }) => (
  <section id="contact" data-testid="contact-section" className="relative py-20 md:py-32 bg-ink text-white overflow-hidden">
    <img src="/img/contact-bg.webp" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-50" />
    <div className="absolute inset-0 blueprint-dark" />
    <div className="relative mx-auto max-w-[1360px] px-5 md:px-10 grid lg:grid-cols-12 gap-10 lg:gap-14">
      <div className="lg:col-span-5">
        <span className="eyebrow !text-slate-300"><span className="text-gold">15</span> — Devis</span>
        <MaskLines className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[0.98]" lines={["Remplissez et", "demandez votre", <span className="text-gold">devis.</span>]} />
        <FadeUp delay={0.15} className="mt-6 text-slate-300 text-lg max-w-md">
          Nous vous recontactons pour donner suite à votre demande.
        </FadeUp>
        <FadeUp delay={0.25} className="mt-10 space-y-4 text-[15px]">
          <div className="flex gap-3"><MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" /><span className="text-slate-200">{BRAND.address}</span></div>
          <a href={BRAND.phoneHref} data-testid="contact-phone-link" className="flex gap-3 hover:text-gold transition-colors"><Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" /><span className="font-mono">{BRAND.phone}</span></a>
          <a href={`mailto:${BRAND.email}`} className="flex gap-3 hover:text-gold transition-colors" data-testid="contact-email"><Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" /><span className="text-slate-200">{BRAND.email}</span></a>
        </FadeUp>
      </div>
      <FadeUp delay={0.1} className="lg:col-span-7 text-ink">
        <QuoteForm onLegal={onLegal} />
      </FadeUp>
    </div>
  </section>
);
