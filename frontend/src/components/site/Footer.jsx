import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { NAV, BRAND } from "@/data/content";
import { scrollToId } from "@/lib/api";
import { useLang } from "@/i18n";

export const Footer = ({ onLegal }) => {
  const { t } = useLang();
  const c = t.footer;
  return (
  <footer data-testid="site-footer" className="bg-paper border-t border-line">
    <div className="mx-auto max-w-[1360px] px-5 md:px-10 pt-16 pb-8">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <Logo className="h-11 md:h-14 w-auto" />
          <p className="mt-5 text-slate-600 max-w-sm leading-relaxed">{c.tagline}</p>
        </div>
        <div className="md:col-span-4">
          <div className="eyebrow mb-4">{c.nav}</div>
          <div className="grid grid-cols-2 gap-2">
            {NAV.map((id) => (
              <button key={id} data-testid={`footer-link-${id}`} onClick={() => scrollToId(id)} className="text-left text-sm text-slate-700 hover:text-steel transition-colors">{t.nav[id]}</button>
            ))}
          </div>
        </div>
        <div className="md:col-span-3 text-sm text-slate-700 space-y-2">
          <div className="eyebrow mb-4">{c.contact}</div>
          <p>{BRAND.address}</p>
          <a href={BRAND.phoneHref} className="block font-mono hover:text-steel">{BRAND.phone}</a>
          <a href={`mailto:${BRAND.email}`} className="block hover:text-steel">{BRAND.email}</a>
          <p>{BRAND.domain}</p>
        </div>
      </div>
      <div className="font-display font-extrabold text-[17vw] md:text-[12vw] leading-[0.8] text-outline mt-14 select-none" aria-hidden="true">GRINDTEK</div>
      <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <span>© {new Date().getFullYear()} GrindTek — {BRAND.company}. {c.rights}</span>
        <div className="flex flex-wrap gap-5">
          <button data-testid="footer-legal-btn" onClick={() => onLegal("legal")} className="hover:text-ink underline-offset-4 hover:underline">{c.legal}</button>
          <button data-testid="footer-privacy-btn" onClick={() => onLegal("privacy")} className="hover:text-ink underline-offset-4 hover:underline">{c.privacy}</button>
          <Link to="/admin" data-testid="footer-admin-link" className="hover:text-ink underline-offset-4 hover:underline">{c.admin}</Link>
        </div>
      </div>
    </div>
  </footer>
  );
};
