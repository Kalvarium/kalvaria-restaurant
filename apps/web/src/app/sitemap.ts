import type { MetadataRoute } from "next";
import { PageSlug } from "@/lib/strapi";
import { SITE_URL } from "@/lib/site";

/**
 * /sitemap.xml — the site's public routes. i18n is cookie-based (one URL per
 * page, no /en or /sk prefix), so each page has a single canonical URL. Home is
 * at "/", every other page at "/<slug>".
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return Object.values(PageSlug).map((slug) => {
    const isHome = slug === PageSlug.Home;
    return {
      url: isHome ? SITE_URL : `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: isHome ? 1 : 0.8,
    };
  });
}
