import { createContext, useContext, useEffect, useState } from "react";
import fr from "./fr";
import en from "./en";
import pt from "./pt";
import es from "./es";
import { api } from "@/lib/api";

export const DICTS = { fr, pt, es, en };
export const LANGS = ["fr", "pt", "es", "en"];
const KEY = "ow_lang";
const Ctx = createContext({ lang: "fr", t: fr, setLang: () => {} });

const stored = () => {
  try {
    const s = localStorage.getItem(KEY);
    return DICTS[s] ? s : null;
  } catch {
    return null;
  }
};

export const LangProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => stored() || "fr");

  useEffect(() => {
    if (stored()) return undefined;
    let alive = true;
    api.get("/geo")
      .then(({ data }) => {
        const l = data?.lang;
        if (alive && DICTS[l] && !stored()) setLangState(l);
      })
      .catch(() => null);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l) => {
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage unavailable */
    }
    setLangState(l);
  };

  return <Ctx.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</Ctx.Provider>;
};

export const useLang = () => useContext(Ctx);

export const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
