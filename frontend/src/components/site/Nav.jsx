import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { NAV } from "@/data/content";
import { scrollToId } from "@/lib/api";

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };
  return (
    <header
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || open ? "bg-white/75 backdrop-blur-xl shadow-[0_1px_0_#dce2e9]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10 h-[68px] flex items-center justify-between">
        <button data-testid="nav-logo" onClick={() => go("top")} aria-label="Accueil OW Auto Grinding">
          <Logo />
        </button>
        <nav className="hidden xl:flex items-center gap-7">
          {NAV.map((n) => (
            <button
              key={n.id}
              data-testid={`nav-link-${n.id}`}
              onClick={() => go(n.id)}
              className="group relative text-[13px] font-medium text-slate-700 hover:text-ink transition-colors"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            data-testid="nav-quote-btn"
            onClick={() => go("contact")}
            className="group hidden sm:inline-flex items-center gap-2 bg-ink text-white text-[13px] font-semibold pl-4 pr-3 py-2.5 rounded-full hover:bg-steel transition-colors"
          >
            Demander un devis
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
          </button>
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen((o) => !o)}
            className="xl:hidden w-10 h-10 grid place-items-center rounded-full border border-line bg-white"
            aria-label="Menu"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="nav-mobile-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden border-t border-line bg-white"
          >
            <div className="px-5 py-4 grid gap-1">
              {[...NAV, { id: "contact", label: "Demander un devis" }].map((n, i) => (
                <button
                  key={n.id}
                  data-testid={`nav-mobile-link-${n.id}`}
                  onClick={() => go(n.id)}
                  className="flex items-center justify-between py-3 border-b border-line text-left font-display text-xl font-semibold"
                >
                  {n.label}
                  <span className="font-mono text-xs text-slate-500">0{i + 1}</span>
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
