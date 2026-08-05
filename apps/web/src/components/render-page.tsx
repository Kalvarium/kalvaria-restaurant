import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { Sections } from "@/components/sections/Sections";
import { getContact, getFeaturedCakes, getGlobal, getPage, SectionComponent } from "@/lib/strapi";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/** Locale from the NEXT_LOCALE cookie, falling back to the default. */
export async function resolveLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** SEO tags for a CMS page — reused by every route's `generateMetadata`. */
export async function pageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug, await resolveLocale());
  if (!page?.seo) return {};
  return { title: page.seo.metaTitle, description: page.seo.metaDescription };
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
  const [global, page, contact] = await Promise.all([
    getGlobal(locale),
    getPage(slug, locale),
    getContact(),
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
  const cakes = needsCakes ? await getFeaturedCakes(6, locale) : [];

  const cta = global.headerCta ?? { label: "Rezervovať stôl", href: "#rezervacia" };

  return (
    <>
      <Header siteName={global.siteName} nav={global.navigation} cta={cta} />
      <div className="flex-1">
        <Sections sections={page.sections} cakes={cakes} />
      </div>
      <Footer global={global} socialLinks={contact?.socialLinks} />
    </>
  );
}
