import { useState } from "react";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { api, formatApiError } from "@/lib/api";
import { useLang } from "@/i18n";

const field = "w-full bg-paper border border-line px-4 py-3 text-ink focus:outline-none focus:border-steel transition-colors";
const EMPTY = { first_name: "", last_name: "", phone: "", website: "" };

export const CallbackForm = ({ c, onLegal, onDone }) => {
  const { lang } = useLang();
  const [v, setV] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!/^[0-9+().\-\s]{6,40}$/.test(v.phone.trim())) return setErr(c.errPhone);
    setBusy(true);
    try {
      await api.post("/callbacks", { ...v, lang });
      setSent(true);
      setV(EMPTY);
    } catch (e2) {
      setErr(formatApiError(e2?.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div data-testid="callback-success" className="mt-4 flex flex-col items-start gap-4">
        <p className="flex items-center gap-2 font-semibold text-ink"><CheckCircle2 className="w-5 h-5 text-steel" />{c.ok}</p>
        <button data-testid="callback-close-btn" onClick={() => { setSent(false); onDone(); }} className="border border-line px-5 py-2.5 rounded-full text-sm font-semibold hover:border-ink transition-colors">{c.close}</button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} data-testid="callback-form" className="mt-4 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input data-testid="callback-first-name" required maxLength={80} autoComplete="given-name" placeholder={c.first} aria-label={c.first} value={v.first_name} onChange={set("first_name")} className={field} />
        <input data-testid="callback-last-name" required maxLength={80} autoComplete="family-name" placeholder={c.last} aria-label={c.last} value={v.last_name} onChange={set("last_name")} className={field} />
      </div>
      <input data-testid="callback-phone" required type="tel" maxLength={40} autoComplete="tel" placeholder={c.phone} aria-label={c.phone} value={v.phone} onChange={set("phone")} className={field} />
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={v.website} onChange={set("website")} className="hidden" />
      {err && <p data-testid="callback-error" className="text-sm text-[#bf0000]">{err}</p>}
      <button data-testid="callback-submit-btn" disabled={busy} className="w-full inline-flex justify-center items-center gap-2 bg-ink text-white font-semibold py-3.5 rounded-full hover:bg-steel disabled:opacity-60 transition-colors">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}{c.submit}
      </button>
      <p className="text-xs text-slate-600">
        {c.note} <button type="button" data-testid="callback-privacy-link" onClick={onLegal} className="underline underline-offset-2 text-steel">{c.noteLink}</button>.
      </p>
    </form>
  );
};
