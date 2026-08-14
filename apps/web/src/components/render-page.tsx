import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Header } from "@/components/sections/Header";
import { ScrollProgress } from "@/components/sections/ScrollProgress";
import { Footer } from "@/components/sections/Footer";
import { Sections } from "@/components/sections/Sections";
import { getGeneralInfo, getCakes, getFeaturedCafes, getFeaturedCakes, getGlobal, getPage, media, ogImages, PageSlug, SectionComponent } from "@/lib/strapi";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/** Locale from the NEXT_LOCALE cookie, falling back to the default. */
export async function resolveLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Browser-tab title + description for a CMS page. Uses the page's SEO metaTitle
 * when set, otherwise builds `{page title} – {site name}` (home is just the
 * site name). Both the page title and site name come from Strapi, so the tab
 * title is translatable per locale.
 */
export async function pageMetadata(slug: string): Promise<Metadata> {
  const locale = await resolveLocale();
  const [page, global] = await Promise.all([getPage(slug, locale), getGlobal(locale)]);
  if (!page) return {};
  const siteName = global?.siteName ?? "Kalvárium 1910";
  const title =
    page.seo?.metaTitle ??
    (slug === PageSlug.Home ? siteName : `${page.title} - ${siteName}`);
  // Per-page SEO overrides; fall back to the site default (Global → defaultSeo).
  const description = page.seo?.metaDescription ?? global?.defaultSeo?.metaDescription;
  const keywords = page.seo?.keywords ?? global?.defaultSeo?.keywords;
  // Page-specific OG image, else the site default (Global → defaultSeo). Set here
  // explicitly because Next replaces (doesn't deep-merge) a child's `openGraph`.
  const images = ogImages(page.seo?.ogImage ?? global?.defaultSeo?.ogImage);
  // Cookie-based i18n → one canonical URL per page (home at "/").
  const path = slug === PageSlug.Home ? "/" : `/${slug}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName, url: path, title, description, ...(images ? { images } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(images ? { images } : {}) },
  };
}

/**
 * Renders any CMS `page` by slug: global chrome (header/footer) plus the page's
 * dynamic zone of section blocks. Add a page + pick sections in Strapi and it
 * renders at its slug — no code change needed.
 *
 * This is a plain async helper the route components `return` directly — NOT a
 * `<Component/>`. Rendering it as a nested async Server Component element trips
 * React 19's dev performance tracking ("cannot have a negative time stamp").
 */
export async function renderPage(slug: string): Promise<ReactNode> {
  const locale = await resolveLocale();
  const [global, page, generalInfo] = await Promise.all([
    getGlobal(locale),
    getPage(slug, locale),
    getGeneralInfo(),
  ]);

  if (!global) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-32 text-center">
        <h1 className="font-display text-4xl">Content failed to load.</h1>
        <p className="max-w-md text-brown-900/70">
          Failed to connect to the CMS. Start Strapi. (<code className="font-mono">npm run dev:cms</code>)
        </p>
      </main>
    );
  }
  if (!page) notFound();

  const needsCakes = page.sections.some((s) => s.__component === SectionComponent.CakeGrid);
  const needsCafes = page.sections.some((s) => s.__component === SectionComponent.CafeGrid);
  // A Form with a `cakes` (dropdown) field needs the full cake list for its options.
  const needsFormCakes = page.sections.some(
    (s) => s.__component === SectionComponent.Form && (s.fields ?? []).some((f) => f.type === "cakes"),
  );
  const [cakes, cafes, formCakes] = await Promise.all([
    needsCakes ? getFeaturedCakes(6, locale) : Promise.resolve([]),
    needsCafes ? getFeaturedCafes(8, locale) : Promise.resolve([]),
    needsFormCakes ? getCakes(locale) : Promise.resolve([]),
  ]);

  const cta = global.headerCta ?? { label: "Rezervovať stôl", href: "/rezervacia" };
  // The navbar sits transparent over a dark hero only when the page opens with one;
  // otherwise (e.g. café, which starts with a light text block) it renders solid.
  const overHero = page.sections[0]?.__component === SectionComponent.Hero;

  return (
    <>
      <Header
        siteName={global.siteName}
        nav={global.navigation}
        cta={cta}
        overHero={overHero}
        logo={media(global.logo?.url)}
      />
      <ScrollProgress />
      <div className="flex-1">
        <Sections
          sections={page.sections}
          cakes={cakes}
          cafes={cafes}
          formCakes={formCakes}
          cakePhone={generalInfo?.contact?.cakePhone}
          reserveHref={cta.href}
          generalInfo={generalInfo ?? undefined}
        />
      </div>
      <Footer global={global} socialLinks={generalInfo?.socialLinks} />
    </>
  );
}
