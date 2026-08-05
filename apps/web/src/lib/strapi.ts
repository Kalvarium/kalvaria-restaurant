/**
 * Strapi CMS client for the web app. Fetches the home page (a dynamic zone of
 * section blocks), the global site settings, and the cake catalog. Server-side only.
 */
import type { ButtonVariant } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui";
import type { SectionBackground } from "./section-background";
import { DEFAULT_LOCALE, type Locale } from "./i18n";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

/** Absolute URL for a Strapi media path (`/uploads/…` → full origin). */
export function media(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

// ---------- shared shapes ----------
export interface StrapiMedia {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}
export interface Link {
  label: string;
  href: string;
  variant?: ButtonVariant;
  isExternal?: boolean;
}
export interface Contact {
  email: string;
  cafePhone: string;
  cakePhone?: string;
  addressLine: string;
  city?: string;
  mapUrl?: string;
}
export interface SocialLink {
  platform: "instagram" | "facebook" | "tiktok" | "youtube" | "tripadvisor" | "other";
  url: string;
}
export interface Global {
  siteName: string;
  tagline?: string;
  logo?: StrapiMedia | null;
  contact: Contact;
  navigation: Link[];
  headerCta?: Link | null;
  footerNavHeading?: string;
  footerEventsHeading?: string;
  footerSocialHeading?: string;
  footerLegal?: string;
  socialLinks?: SocialLink[];
  reservation?: { enabled: boolean; url?: string; email?: string; phone?: string };
}

// ---------- blocks (minimal) ----------
export interface Block {
  type: string;
  children?: { type?: string; text?: string }[];
}

// ---------- sections ----------
/** Dynamic-zone component UIDs (the `__component` discriminant of each section). */
export const SectionComponent = {
  Hero: "sections.hero",
  MediaText: "sections.media-text",
  FeatureCards: "sections.feature-cards",
  Quote: "sections.quote",
  CakeGrid: "sections.cake-grid",
  ReservationCta: "sections.reservation-cta",
  Gallery: "sections.gallery",
} as const;
export type SectionComponent = (typeof SectionComponent)[keyof typeof SectionComponent];

export type Scrim = "light" | "medium" | "strong";
export interface HeroSection {
  __component: typeof SectionComponent.Hero;
  id: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  background?: StrapiMedia | null;
  ctas?: Link[];
  scrim?: Scrim;
}
export interface MediaTextSection {
  __component: typeof SectionComponent.MediaText;
  id: number;
  background?: SectionBackground;
  eyebrow?: string;
  heading?: string;
  body?: Block[];
  image?: StrapiMedia | null;
  imageSide?: "left" | "right";
}

export interface FeatureCard {
  id?: number;
  eyebrow?: string;
  title: string;
  description?: string;
  image?: StrapiMedia | null;
  linkLabel?: string;
  linkHref?: string;
}
export interface FeatureCardsSection {
  __component: typeof SectionComponent.FeatureCards;
  id: number;
  background?: SectionBackground;
  heading?: string;
  cards: FeatureCard[];
}
export interface QuoteSection {
  __component: typeof SectionComponent.Quote;
  id: number;
  background?: SectionBackground;
  quote: string;
  author?: string;
}
export interface CakeGridSection {
  __component: typeof SectionComponent.CakeGrid;
  id: number;
  background?: SectionBackground;
  heading?: string;
  intro?: string;
  mode: "featured" | "all" | "by_category";
  categorySlug?: string;
  limit?: number;
}
export interface ReservationCtaSection {
  __component: typeof SectionComponent.ReservationCta;
  id: number;
  background?: SectionBackground;
  heading: string;
  body?: string;
  button?: Link;
}
export interface GallerySection {
  __component: typeof SectionComponent.Gallery;
  id: number;
  background?: SectionBackground;
  heading?: string;
  images: StrapiMedia[];
}
export type Section =
  | HeroSection
  | MediaTextSection
  | FeatureCardsSection
  | CakeGridSection
  | ReservationCtaSection
  | QuoteSection
  | GallerySection;

export interface PageEntry {
  title: string;
  slug: string;
  sections: Section[];
  seo?: { metaTitle: string; metaDescription: string; keywords?: string };
}

// ---------- cakes ----------
export interface Cake {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  priceUnit?: string;
  image?: StrapiMedia[];
  badge?: { label: string; variant?: BadgeVariant } | null;
  featured: boolean;
  rank: number;
}

// ---------- fetching ----------
async function strapiGet<T>(pathAndQuery: string): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${pathAndQuery}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

const PAGE_POPULATE = [
  "populate[sections][on][sections.hero][populate][background]=true",
  "populate[sections][on][sections.hero][populate][ctas]=true",
  "populate[sections][on][sections.media-text][populate][image]=true",
  "populate[sections][on][sections.feature-cards][populate][cards][populate][image]=true",
  "populate[sections][on][sections.cake-grid][populate]=*",
  "populate[sections][on][sections.reservation-cta][populate][button]=true",
  "populate[sections][on][sections.quote][populate]=*",
  "populate[sections][on][sections.gallery][populate][images]=true",
  "populate[seo]=true",
].join("&");

const GLOBAL_POPULATE = [
  "populate[navigation]=true",
  "populate[headerCta]=true",
  "populate[logo]=true",
].join("&");

/** Global site settings for a locale, falling back to the default locale. */
export async function getGlobal(locale: Locale = DEFAULT_LOCALE): Promise<Global | null> {
  const one = (loc: Locale) => strapiGet<Global>(`global?${GLOBAL_POPULATE}&locale=${loc}`);
  return (await one(locale)) ?? (locale !== DEFAULT_LOCALE ? await one(DEFAULT_LOCALE) : null);
}

// ---------- contact single type ----------
export interface ContactEntry {
  socialLinks?: SocialLink[];
}

const CONTACT_POPULATE = ["populate[socialLinks]=true"].join("&");

/** Contact single type (address, hours, socials, reservation) — not localized; one shared entry. */
export async function getContact(): Promise<ContactEntry | null> {
  return strapiGet<ContactEntry>(`contact?${CONTACT_POPULATE}`);
}

/**
 * Known CMS page slugs — the `slug` (uid) of each `page` entry in Strapi.
 * Use these instead of passing raw strings to `getPage`.
 */
export const PageSlug = {
  Home: "home",
  About: "o-nas",
  Cakes: "torty",
  Cafe: "kaviaren",
  Space: "priestor-hore",
  Gallery: "galeria",
  Contact: "kontakt",
} as const;
export type PageSlug = (typeof PageSlug)[keyof typeof PageSlug];

/** Fetch a page by slug (the homepage is `PageSlug.Home`) for a locale, with fallback. */
export async function getPage(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<PageEntry | null> {
  const query = (loc: Locale) =>
    `pages?filters[slug][$eq]=${encodeURIComponent(slug)}&${PAGE_POPULATE}&locale=${loc}`;
  const data = await strapiGet<PageEntry[]>(query(locale));
  if (data?.[0]) return data[0];
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await strapiGet<PageEntry[]>(query(DEFAULT_LOCALE));
    return fallback?.[0] ?? null;
  }
  return null;
}

export async function getFeaturedCakes(limit = 6, locale: Locale = DEFAULT_LOCALE): Promise<Cake[]> {
  const qs = (loc: Locale) =>
    [
      "filters[featured][$eq]=true",
      "filters[available][$eq]=true",
      "populate[image]=true",
      "populate[badge]=true",
      "sort[0]=rank:asc",
      `pagination[limit]=${limit}`,
      `locale=${loc}`,
    ].join("&");
  let data = await strapiGet<Cake[]>(`cakes?${qs(locale)}`);
  if ((!data || data.length === 0) && locale !== DEFAULT_LOCALE) {
    data = await strapiGet<Cake[]>(`cakes?${qs(DEFAULT_LOCALE)}`);
  }
  return data ?? [];
}
