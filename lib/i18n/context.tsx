"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  dictionaries,
  locales,
  type Locale,
} from "./dictionaries";
import { dashDictionaries } from "./dash-dictionaries";
import { screensDictionaries } from "./screens-dictionaries";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (typeof dictionaries)[Locale];
  d: (typeof dashDictionaries)[Locale];
  s: (typeof screensDictionaries)[Locale];
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "eduai-locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uz");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && locales.includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: dictionaries[locale],
        d: dashDictionaries[locale],
        s: screensDictionaries[locale],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
