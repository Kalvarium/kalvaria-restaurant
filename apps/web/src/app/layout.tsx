import type { Metadata } from "next";
import { cookies } from "next/headers";
import { fontVariables } from "@/lib/fonts";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/locale-context";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Kalvárium 1910 — Kaviareň & Torty, Nitra",
  description:
    "Historický dom s dušou v srdci Nitry. Domáce torty, výberová káva a priestor pre vaše oslavy.",
  icons: {
    icon: [{ url: "/kalvarium_logo_black.svg", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-brown-900 font-accent">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
