export const LogoMark = ({ className = "w-8 h-8", light = false }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <circle cx="16" cy="16" r="11.5" fill="none" stroke={light ? "#ffffff" : "#2b4c6f"} strokeWidth="3" />
    <polyline points="9,12 12,20.5 16,14.5 20,20.5 23,12" fill="none" stroke="#c5b358" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Logo = ({ light = false }) => (
  <span className="flex items-center gap-2.5">
    <LogoMark light={light} />
    <span className="leading-none">
      <span className={`font-display font-extrabold text-lg ${light ? "text-white" : "text-ink"}`}>OW</span>
      <span className={`block font-mono text-[10px] tracking-[0.24em] mt-0.5 ${light ? "text-slate-300" : "text-slate-600"}`}>
        AUTO GRINDING
      </span>
    </span>
  </span>
);
