import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Loader2, Lock, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MATERIALS, MACHINES } from "@/data/content";
import { api, formatApiError } from "@/lib/api";
import { useLang } from "@/i18n";

const EMPTY = { name: "", company: "", phone: "", email: "", material: "", machine: "", message: "", consent: false, website: "" };
const input = "w-full bg-paper border border-line px-4 py-3.5 text-[15px] text-ink placeholder:text-slate-500 focus:outline-none focus:border-steel focus:bg-white transition-colors";

const TextField = ({ id, label, type = "text", value, onChange, required = true }) => (
  <label className="block">
    <span className="block text-sm font-medium text-ink mb-1.5">{label}{required && <span className="text-steel"> *</span>}</span>
    <input data-testid={`quote-input-${id}`} type={type} required={required} value={value} onChange={(e) => onChange(id, e.target.value)} className={input} />
  </label>
);

export const QuoteForm = ({ onLegal }) => {
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const { t, lang } = useLang();
  const c = t.form;

  useEffect(() => {
    const on = (e) => {
      setDone(false);
      setF((p) => ({ ...p, machine: e.detail || "" }));
    };
    window.addEventListener("ow:machine", on);
    return () => window.removeEventListener("ow:machine", on);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.material) return toast.error(c.errMaterial);
    if (!f.consent) return toast.error(c.errConsent);
    setBusy(true);
    try {
      await api.post("/quotes", { ...f, machine: f.machine || null, message: f.message || null, lang });
      setDone(true);
      setF(EMPTY);
      toast.success(c.ok);
    } catch (err) {
      toast.error(formatApiError(err?.response?.data?.detail) || c.fail);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div data-testid="quote-success" className="bg-white p-8 md:p-12 text-center">
        <CheckCircle2 className="w-12 h-12 text-steel mx-auto" />
        <h3 className="font-display font-bold text-2xl mt-4">{c.successTitle}</h3>
        <p className="text-slate-600 mt-2">{c.successText}</p>
        <button data-testid="quote-new-btn" onClick={() => setDone(false)} className="mt-6 font-semibold text-steel underline underline-offset-4">{c.again}</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} data-testid="quote-form" className="relative bg-white p-6 md:p-10 grid sm:grid-cols-2 gap-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={(e) => set("website", e.target.value)} className="absolute -left-[9999px] w-px h-px opacity-0" />
      <TextField id="name" label={c.name} value={f.name} onChange={set} />
      <TextField id="company" label={c.company} value={f.company} onChange={set} />
      <TextField id="phone" label={c.phone} type="tel" value={f.phone} onChange={set} />
      <TextField id="email" label={c.email} type="email" value={f.email} onChange={set} />
      <div>
        <span className="block text-sm font-medium text-ink mb-1.5">{c.material}<span className="text-steel"> *</span></span>
        <Select value={f.material} onValueChange={(v) => set("material", v)}>
          <SelectTrigger data-testid="quote-select-material" className="h-[50px] rounded-none bg-paper border-line"><SelectValue placeholder={c.materialPh} /></SelectTrigger>
          <SelectContent>
            {MATERIALS.map((m) => <SelectItem key={m} value={m} data-testid={`quote-material-${m}`}>{c.materials[m]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <span className="block text-sm font-medium text-ink mb-1.5">{c.machine}</span>
        <Select value={f.machine || "none"} onValueChange={(v) => set("machine", v === "none" ? "" : v)}>
          <SelectTrigger data-testid="quote-select-machine" className="h-[50px] rounded-none bg-paper border-line"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{c.unsure}</SelectItem>
            {MACHINES.map((m) => <SelectItem key={m.id} value={m.id} data-testid={`quote-machine-${m.id.replace(" ", "").toLowerCase()}`}>{m.id}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <label className="block sm:col-span-2">
        <span className="block text-sm font-medium text-ink mb-1.5">{c.project}</span>
        <textarea data-testid="quote-input-message" rows={3} value={f.message} onChange={(e) => set("message", e.target.value)} className={`${input} resize-none`} placeholder={c.projectPh} />
      </label>
      <label className="sm:col-span-2 flex items-start gap-3 text-sm text-slate-600">
        <Checkbox data-testid="quote-consent-checkbox" checked={f.consent} onCheckedChange={(v) => set("consent", v === true)} className="mt-0.5" />
        <span>
          {c.consent}{" "}
          <button type="button" data-testid="quote-privacy-link" onClick={() => onLegal("privacy")} className="underline underline-offset-2 text-steel">{c.consentLink}</button>.
        </span>
      </label>
      <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
        <span className="flex items-center gap-2 text-xs text-slate-600"><Lock className="w-3.5 h-3.5" />{c.secure}</span>
        <button
          type="submit"
          disabled={busy}
          data-testid="quote-submit-btn"
          className="group inline-flex items-center gap-2 bg-steel text-white font-semibold px-7 py-3.5 rounded-full hover:bg-ink disabled:opacity-60 transition-colors"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {c.submit}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
};
