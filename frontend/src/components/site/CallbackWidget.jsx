import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CallbackForm } from "./CallbackForm";
import { useLang } from "@/i18n";

const EVENT = "grindtek:open-callback";
export const openCallback = () => window.dispatchEvent(new Event(EVENT));

export const CallbackWidget = ({ onLegal }) => {
  const { t } = useLang();
  const c = t.callback;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  const showLegal = () => {
    setOpen(false);
    onLegal("privacy");
  };
  return (
    <>
      <button
        data-testid="callback-floating-btn"
        onClick={() => setOpen(true)}
        className="group fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 inline-flex items-center gap-2.5 bg-gold text-ink font-semibold pl-3 pr-5 py-3 rounded-full shadow-[0_12px_32px_-8px_rgba(13,20,32,0.45)] hover:bg-ink hover:text-white transition-colors"
      >
        <span className="relative grid place-items-center w-8 h-8 rounded-full bg-ink text-gold group-hover:bg-gold group-hover:text-ink transition-colors">
          <span className="absolute inset-0 rounded-full bg-ink/40 animate-ping motion-reduce:hidden" />
          <Phone className="relative w-4 h-4" />
        </span>
        {c.btn}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-testid="callback-dialog" data-lenis-prevent className="w-[calc(100%-2rem)] max-w-md rounded-none border-line p-7 sm:p-8">
          <DialogTitle className="font-display font-bold text-2xl text-ink">{c.title}</DialogTitle>
          <DialogDescription className="text-slate-600">{c.text}</DialogDescription>
          <CallbackForm c={c} onLegal={showLegal} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
