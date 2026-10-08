import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BRAND } from "@/data/content";
import { useLang, fill } from "@/i18n";

const H = ({ children }) => <h3 className="font-display font-bold text-lg text-ink mt-7 mb-2">{children}</h3>;

const Sections = ({ items }) => (
  <>
    {items.map(([h, ps]) => (
      <div key={h}>
        <H>{h}</H>
        {ps.map((p) => <p key={p}>{fill(p, BRAND)}</p>)}
      </div>
    ))}
  </>
);

export const LegalDialog = ({ open, onClose }) => {
  const { t } = useLang();
  const c = t.legal;
  return (
  <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent data-testid="legal-dialog" className="max-w-2xl rounded-none p-0 gap-0">
      <DialogHeader className="p-6 md:p-8 border-b border-line">
        <DialogTitle className="font-display font-bold text-2xl">{open === "privacy" ? c.privacyTitle : c.legalTitle}</DialogTitle>
        <DialogDescription className="font-mono text-xs uppercase tracking-[0.14em]">OW Auto Grinding — {BRAND.domain}</DialogDescription>
      </DialogHeader>
      <div data-lenis-prevent className="max-h-[65vh] overflow-y-auto p-6 md:p-8 text-[15px] text-slate-700 leading-relaxed space-y-2">
        <Sections items={open === "privacy" ? c.privacySections : c.legalSections} />
      </div>
    </DialogContent>
  </Dialog>
  );
};
