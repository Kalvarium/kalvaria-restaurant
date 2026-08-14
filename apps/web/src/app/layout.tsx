import type { Metadata } from "next";
import { cookies } from "next/headers";
import { fontVariables } from "@/lib/fonts";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/locale-context";
import { getGlobal, media } from "@/lib/strapi";
import { ogImages, SITE_NAME, SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

const DESCRIPTION =
  "Historický dom s dušou v srdci Nitry. Domáce torty, výberová káva a priestor pre vaše oslavy.";
const TITLE = `${SITE_NAME} — Kaviareň & Torty, Nitra`;

export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobal();

  // Favicon = the Global logo, but served same-origin via /site-icon (a proxy) so
  // Google/browsers fetch it from the main domain, not the cross-origin CMS subdomain.
  const iconType = (media(global?.logo?.url) ?? ".svg").endsWith(".svg") ? "image/svg+xml" : "image/png";

  // Site-wide SEO defaults come from Global → defaultSeo (title, description,
  // keywords, OG image), with hardcoded fallbacks if it's unset.
  const seo = global?.defaultSeo;
  const title = seo?.metaTitle ?? TITLE;
  const description = seo?.metaDescription ?? DESCRIPTION;
  const images = ogImages(seo?.ogImage);

  return {
    // Makes OG/canonical relative URLs resolve absolute.
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: seo?.keywords,
    icons: { icon: [{ url: "/site-icon", type: iconType }], apple: "/site-icon" },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "sk_SK", url: SITE_URL, title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

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
