import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  withCredentials: true,
});

export function formatApiError(detail) {
  if (detail == null) return "Une erreur est survenue. Veuillez réessayer.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => (typeof e?.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (typeof detail?.msg === "string") return detail.msg;
  return String(detail);
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function requestMachine(machine) {
  window.dispatchEvent(new CustomEvent("ow:machine", { detail: machine }));
  scrollToId("contact");
}
