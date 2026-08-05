"use client";

import { createContext, useContext, type ReactNode } from "react";
import { LOCALE_COOKIE, otherLocale, type Locale } from "./i18n";

interface LocaleContextValue {
  /** The active locale (resolved server-side from the cookie). */
  locale: Locale;
  /** Switch to a specific locale (writes the cookie and reloads). */
  setLocale: (locale: Locale) => void;
  /** Switch to the other locale. */
  toggle: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const setLocale = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // Content is cookie-driven + force-dynamic; a full reload renders the new locale cleanly.
    window.location.reload();
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggle: () => setLocale(otherLocale(locale)) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a <LocaleProvider>");
  return ctx;
}
