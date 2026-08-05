/** Locales the site supports. Slovak is the default (source) locale in Strapi. */
export const LOCALES = ["sk", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "sk";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** The locale to switch to from the current one (2-locale toggle). */
export function otherLocale(current: Locale): Locale {
  return current === "sk" ? "en" : "sk";
}
