import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHead, FadeUp } from "./Reveal";
import { useLang } from "@/i18n";

export const Faq = () => {
  const { t } = useLang();
  return (
  <section id="faq" data-testid="faq-section" className="py-20 md:py-32 bg-white border-y border-line">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10">
      <SectionHead index="13" label={t.faq.label} lines={[t.faq.title]} />
      <FadeUp className="lg:ml-[25%]">
        <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-line">
          {t.faq.items.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-line" data-testid={`faq-item-${i}`}>
              <AccordionTrigger data-testid={`faq-trigger-${i}`} className="py-6 text-left font-display font-semibold text-lg md:text-xl text-ink hover:no-underline hover:text-steel">
                <span className="flex gap-5"><span className="font-mono text-sm text-gold-dark pt-1">0{i + 1}</span>{f.q}</span>
              </AccordionTrigger>
              <AccordionContent className="pl-10 pr-4 pb-6 text-base text-slate-600 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeUp>
    </div>
  </section>
  );
};
