/**
 * Canonical public site URL — used for the sitemap, robots, canonical links and
 * Open Graph absolute URLs. Set `NEXT_PUBLIC_SITE_URL` in the host dashboard;
 * defaults to the production domain. Never has a trailing slash.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kalvarium.sk").replace(/\/+$/, "");

/** Site name / brand, used in titles and OG metadata. */
export const SITE_NAME = "Kalvárium 1910";
