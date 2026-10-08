import { useEffect } from "react";
import Lenis from "lenis";

export const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
};
