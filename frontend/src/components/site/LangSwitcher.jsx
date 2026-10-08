import { LANGS, useLang } from "@/i18n";

export const LangSwitcher = ({ className = "" }) => {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.nav.lang} data-testid="lang-switcher" className={`inline-flex p-0.5 rounded-full border border-line bg-white ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l}
          data-testid={`lang-btn-${l}`}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1.5 rounded-full font-mono text-[11px] font-medium uppercase transition-colors ${lang === l ? "bg-ink text-white" : "text-slate-600 hover:text-ink"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
};
