/**
 * Canonical public site URL — used for the sitemap, robots, canonical links and
 * Open Graph absolute URLs. Set `NEXT_PUBLIC_SITE_URL` in the host dashboard;
 * defaults to the production domain. Never has a trailing slash.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kalvarium.sk").replace(/\/+$/, "");

/** Site name / brand, used in titles and OG metadata. */
export const SITE_NAME = "Kalvárium 1910";

import type { StrapiMedia } from "./strapi";

/**
 * Build the OG/Twitter `images` array. The image is served through the site's own
 * `/og-image` route (a proxy to the CMS upload) so crawlers — WhatsApp especially —
 * only ever fetch the main domain, not the cross-origin CMS subdomain. Width/height/
 * type are still emitted (WhatsApp needs the dimensions). Returns undefined if no image.
 */
export function ogImages(
  img?: StrapiMedia | null,
): { url: string; width?: number; height?: number; type?: string }[] | undefined {
  const path = img?.url;
  if (!path) return undefined;
  // Only the CMS upload path is passed through; the route restricts to /uploads/.
  const uploadsPath = path.startsWith("http") ? new URL(path).pathname : path;
  const url = `${SITE_URL}/og-image?u=${encodeURIComponent(uploadsPath)}`;
  const lower = uploadsPath.toLowerCase();
  const type = img?.mime ?? (lower.endsWith(".png") ? "image/png" : /\.jpe?g$/.test(lower) ? "image/jpeg" : undefined);
  return [{ url, width: img?.width, height: img?.height, type }];
}
