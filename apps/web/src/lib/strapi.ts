/**
 * Strapi CMS client for the web app. Fetches the home page (a dynamic zone of
 * section blocks), the global site settings, and the cake catalog. Server-side only.
 */
import type { ButtonVariant } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui";
import type { SectionBackground } from "./section-background";
import { DEFAULT_LOCALE, type Locale } from "./i18n";

// Public Strapi base URL. `NEXT_PUBLIC_` so it's available in the browser too —
// `media()` runs in client components (CakeCard/CafeCard/Form), so image URLs are
// built client-side. `STRAPI_URL` kept as a server-only fallback for older setups.
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? process.env.STRAPI_URL ?? "http://localhost:1337";

/** Absolute URL for a Strapi media path (`/uploads/…` → full origin). */
export function media(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

// ---------- shared shapes ----------
export interface StrapiMedia {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
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

// ---------- rich-text blocks (Strapi "blocks" editor) ----------
// One recursive node type covers block nodes (paragraph, heading, list, quote,
// code, list-item), inline text leaves (with marks), and inline links.
export interface Block {
  type: string;
  children?: Block[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  url?: string; // link nodes
  level?: number; // heading level (1–6)
  format?: "ordered" | "unordered"; // list nodes
}

// ---------- sections ----------
/** Dynamic-zone component UIDs (the `__component` discriminant of each section). */
export const SectionComponent = {
  Hero: "sections.hero",
  MediaText: "sections.media-text",
  Quote: "sections.quote",
  CakeGrid: "sections.cake-grid",
  CafeGrid: "sections.cafe-grid",
  Gallery: "sections.gallery",
  Text: "sections.text",
  VenueInfo: "sections.venue-info",
  CardGrid: "sections.card-grid",
  Map: "sections.map",
  CtaCard: "sections.cta-card",
  Form: "sections.form",
} as const;
export type SectionComponent = (typeof SectionComponent)[keyof typeof SectionComponent];

export type Scrim = "none" | "light" | "medium" | "strong";
/** Hero height: full-screen (home), tall (~half, interior pages), or short. */
export const HeroSize = {
  Full: "full",
  Tall: "tall",
  Short: "short",
} as const;
export type HeroSize = (typeof HeroSize)[keyof typeof HeroSize];

/** Max width of the hero's text column (varies per page). */
export const HeroTextWidth = {
  Sm: "sm",
  Md: "md",
  Lg: "lg",
  Xl: "xl",
  Full: "full",
} as const;
export type HeroTextWidth = (typeof HeroTextWidth)[keyof typeof HeroTextWidth];

export interface HeroSection {
  __component: typeof SectionComponent.Hero;
  id: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  background?: StrapiMedia | null;
  ctas?: Link[];
  scrim?: Scrim;
  size?: HeroSize;
  /** Width of the text column (default md). */
  textWidth?: HeroTextWidth;
}
export interface MediaTextSection {
  __component: typeof SectionComponent.MediaText;
  id: number;
  background?: SectionBackground;
  /** `contained` (default two-column card) or `full` (full-bleed edge-to-edge band). */
  variant?: "contained" | "full";
  eyebrow?: string;
  heading?: string;
  body?: Block[];
  image?: StrapiMedia | null;
  imageSide?: "left" | "right";
  showCaption?: boolean;
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
  /** Editor-curated cakes for this grid (drag to order). Empty → featured cakes. */
  cakes?: Cake[];
  limit?: number;
  /** Optional "order a cake" card shown as the last grid cell. */
  ctaHeading?: string;
  ctaBody?: string;
  ctaButton?: Link;
  /** Localized UI labels for the cards / detail dialog. */
  orderLabel?: string;
  callLabel?: string;
  allergensLabel?: string;
  emptyText?: string;
}
export interface CafeGridSection {
  __component: typeof SectionComponent.CafeGrid;
  id: number;
  background?: SectionBackground;
  heading?: string;
  intro?: string;
  /** Editor-curated café items (drag to order). Empty → featured items. */
  cafes?: Cafe[];
  limit?: number;
  /** Optional "order" card shown as the last grid cell. */
  ctaHeading?: string;
  ctaBody?: string;
  ctaButton?: Link;
  /** Localized UI labels for the cards / detail dialog. */
  reserveLabel?: string;
  callLabel?: string;
  favoriteLabel?: string;
  emptyText?: string;
}
/** A contained call-to-action card: a text column and a button, on a coloured card panel. */
export interface CtaCardSection {
  __component: typeof SectionComponent.CtaCard;
  id: number;
  /** Background of the whole section band (default cream). */
  background?: SectionBackground;
  /** Background of the card panel itself (default green). */
  cardBackground?: SectionBackground;
  /** Show a hairline divider line above the card (content width). */
  topDivider?: boolean;
  eyebrow?: string;
  heading?: string;
  body?: Block[];
  /** Body-prose type scale (default small = 18px). */
  bodySize?: TextSize;
  /** Call-to-action button shown to the right of the text. */
  button?: Link;
}
/** A form (reservation, cake order, upstairs enquiry, …) that emails the restaurant. */
export type FormRecipient = "reservation" | "upstairs" | "cakes";
export type FormFieldType =
  | "text"
  | "tel"
  | "email"
  | "date"
  | "time"
  | "number"
  | "textarea"
  | "checkbox"
  | "cakes";
/** One input in the form — each is a `shared.form-field` entry in the CMS. */
export interface FormField {
  id?: number;
  /** Data key posted to the endpoint (e.g. "phone"). */
  name: string;
  label: string;
  type?: FormFieldType;
  placeholder?: string;
  required?: boolean;
  /** Span both columns of the field grid (e.g. a note textarea). */
  fullWidth?: boolean;
  min?: string;
  max?: string;
}
export interface FormSection {
  __component: typeof SectionComponent.Form;
  id: number;
  /** Which address (from the Email single type) this form emails. */
  recipient?: FormRecipient;
  /** `page` = full-page form inline; `dialog` = a modal opened by an external link pointing to `#<anchor>`. */
  display?: "page" | "dialog";
  /** `dialog` only: id that opens this form when a link points to `#<anchor>` (e.g. a Cake Grid button). */
  anchor?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  /** Optional Text blocks shown above the fields (formatted prose + links). */
  content?: TextContentData[];
  /** The form's inputs, in order. */
  fields?: FormField[];
  image?: StrapiMedia | null;
  quote?: string;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
}
/** How many images sit in one row of a gallery (on desktop). */
export const GalleryColumns = {
  Two: "2",
  Three: "3",
  Four: "4",
  Five: "5",
  Six: "6",
} as const;
export type GalleryColumns = (typeof GalleryColumns)[keyof typeof GalleryColumns];

/** Gallery layout: a uniform 4:3 grid, or a staggered strip with varied image heights. */
export const GalleryLayout = {
  Grid: "grid",
  Staggered: "staggered",
} as const;
export type GalleryLayout = (typeof GalleryLayout)[keyof typeof GalleryLayout];

export interface GallerySection {
  __component: typeof SectionComponent.Gallery;
  id: number;
  background?: SectionBackground;
  eyebrow?: string;
  heading?: string;
  /** Alignment of the eyebrow + heading (`left` default / `center`). */
  align?: TextAlign;
  columns?: GalleryColumns;
  /** `grid` (uniform 4:3) or `staggered` (4-up strip with varied heights). */
  layout?: GalleryLayout;
  showCaptions?: boolean;
  images: StrapiMedia[];
}
/** Horizontal alignment of a text block: left prose vs. a centered section intro. */
export const TextAlign = {
  Left: "left",
  Center: "center",
} as const;
export type TextAlign = (typeof TextAlign)[keyof typeof TextAlign];

/** Text-block type scale: scales the heading and body prose per section. */
export const TextSize = {
  XSmall: "xsmall",
  Small: "small",
  Medium: "medium",
  Large: "large",
  XLarge: "xlarge",
  XXLarge: "xxlarge",
  XXXLarge: "xxxlarge",
} as const;
export type TextSize = (typeof TextSize)[keyof typeof TextSize];

/** The inner content of a Text block — reusable wherever a Text can be embedded (e.g. the Form). */
export interface TextContentData {
  id?: number;
  eyebrow?: string;
  heading?: string;
  body?: Block[];
  /** Optional call-to-action button below the body. */
  button?: Link;
  /** Heading type scale (independent of the body). */
  titleSize?: TextSize;
  /** Body-prose type scale (independent of the heading). */
  bodySize?: TextSize;
}
export interface TextSection extends TextContentData {
  __component: typeof SectionComponent.Text;
  id: number;
  background?: SectionBackground;
  /** Show a hairline divider line above the block (content width). */
  topDivider?: boolean;
  align?: TextAlign;
}
/** A bullet in a feature list. */
export interface ListItem {
  id?: number;
  text: string;
}
/** A label/value row in an info card. */
export interface InfoRow {
  id?: number;
  label: string;
  value: string;
}
/** Card icon choices (rendered as inline SVGs in the block). */
export type CardIcon = "none" | "location" | "clock" | "phone" | "mail" | "info";
/** Which General Info data the card renders. */
export type CardSource = "address" | "hours" | "contact";
export type CardBackground = "white" | "cream" | "green" | "brown";
/** One card in a Card Grid. */
export interface InfoCard {
  id?: number;
  icon?: CardIcon;
  title?: string;
  source?: CardSource;
  /** Small note under the content, e.g. "Operator: Quo Vadis s.r.o." */
  note?: string;
  /** Content text scale. */
  size?: TextSize;
  background?: CardBackground;
}
/** One opening-hours row: a day/range label and its time (editor-written, grouped in the CMS). */
export interface OpeningHour {
  id?: number;
  days?: string;
  time?: string;
}
export interface CardGridSection {
  __component: typeof SectionComponent.CardGrid;
  id: number;
  background?: SectionBackground;
  eyebrow?: string;
  heading?: string;
  align?: TextAlign;
  columns?: "2" | "3" | "4";
  cards?: InfoCard[];
  /** Opening-hours rows for an `hours`-source card — localized (day labels differ per language). */
  openingHours?: OpeningHour[];
  /** Row labels for a `contact`-source card (translatable). */
  cafeLabel?: string;
  cakesLabel?: string;
  emailLabel?: string;
}
export interface MapSection {
  __component: typeof SectionComponent.Map;
  id: number;
  background?: SectionBackground;
  embedUrl: string;
}
export interface VenueInfoSection {
  __component: typeof SectionComponent.VenueInfo;
  id: number;
  background?: SectionBackground;
  /** Left column: intro prose. */
  body?: Block[];
  /** Left column: bulleted feature list under the prose. */
  features?: ListItem[];
  /** Right card heading, e.g. "Space Information". */
  cardHeading?: string;
  /** Right card rows (Capacity, Offering, View…). */
  rows?: InfoRow[];
}
export type Section =
  | HeroSection
  | MediaTextSection
  | CakeGridSection
  | CafeGridSection
  | QuoteSection
  | GallerySection
  | TextSection
  | VenueInfoSection
  | CardGridSection
  | MapSection
  | CtaCardSection
  | FormSection;

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
  description?: string;
  allergens?: string;
  price: number;
  currency: string;
  /** Qualifier before the amount, e.g. "from" → "from €12". */
  pricePrefix?: string;
  /** Unit after the amount, e.g. "/box" → "€12/box". */
  priceUnit?: string;
  image?: StrapiMedia[];
  badge?: { label: string; variant?: BadgeVariant } | null;
  featured: boolean;
}

// ---------- cafe menu ----------
export interface Cafe {
  id: number;
  name: string;
  description?: string;
  /** Café equivalent of a cake's allergens — a "favourite" note, e.g. "Our baristas' pick". */
  favorite?: string;
  price: number;
  currency: string;
  pricePrefix?: string;
  priceUnit?: string;
  image?: StrapiMedia[];
  badge?: { label: string; variant?: BadgeVariant } | null;
  featured: boolean;
  /** Render as a wide, image-only overlay tile spanning 2 columns (e.g. Soft-Serve, Lemonades). */
  wide?: boolean;
}

// ---------- fetching ----------
async function strapiGet<T>(pathAndQuery: string): Promise<T | null> {
  try {
    // Always fetch fresh: pages are force-dynamic and editors expect CMS edits
    // (captions, text, images) to show on the next refresh, not up to 60s later.
    const res = await fetch(`${STRAPI_URL}/api/${pathAndQuery}`, {
      cache: "no-store",
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
  "populate[sections][on][sections.cake-grid][populate][cakes][populate][image]=true",
  "populate[sections][on][sections.cake-grid][populate][cakes][populate][badge]=true",
  "populate[sections][on][sections.cake-grid][populate][ctaButton]=true",
  "populate[sections][on][sections.cafe-grid][populate][cafes][populate][image]=true",
  "populate[sections][on][sections.cafe-grid][populate][cafes][populate][badge]=true",
  "populate[sections][on][sections.cafe-grid][populate][ctaButton]=true",
  "populate[sections][on][sections.quote][populate]=*",
  "populate[sections][on][sections.gallery][populate][images]=true",
  "populate[sections][on][sections.text][populate]=*",
  "populate[sections][on][sections.venue-info][populate]=*",
  "populate[sections][on][sections.card-grid][populate]=*",
  "populate[sections][on][sections.map][populate]=*",
  "populate[sections][on][sections.cta-card][populate][button]=true",
  "populate[sections][on][sections.form][populate][image]=true",
  "populate[sections][on][sections.form][populate][fields]=true",
  "populate[sections][on][sections.form][populate][content][populate][button]=true",
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

// ---------- general info single type ----------
export interface GeneralInfoEntry {
  contact?: Contact;
  socialLinks?: SocialLink[];
}

const GENERAL_INFO_POPULATE = ["populate[contact]=true", "populate[socialLinks]=true"].join("&");

/** General Info single type (address, socials, reservation) — shared across all languages. */
export async function getGeneralInfo(): Promise<GeneralInfoEntry | null> {
  return strapiGet<GeneralInfoEntry>(`general-info?${GENERAL_INFO_POPULATE}`);
}

// ---------- email single type ----------
/** Form recipient addresses. The notification-email wording lives in code (lib/email). */
export interface EmailEntry {
  reservationEmail?: string;
  upstairsEmail?: string;
  cakesEmail?: string;
}
export async function getEmails(): Promise<EmailEntry | null> {
  return strapiGet<EmailEntry>("email");
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
      "sort[0]=name:asc",
      `pagination[limit]=${limit}`,
      `locale=${loc}`,
    ].join("&");
  let data = await strapiGet<Cake[]>(`cakes?${qs(locale)}`);
  if ((!data || data.length === 0) && locale !== DEFAULT_LOCALE) {
    data = await strapiGet<Cake[]>(`cakes?${qs(DEFAULT_LOCALE)}`);
  }
  return data ?? [];
}

/** All available cakes (name is enough for a form dropdown), sorted by name. */
export async function getCakes(locale: Locale = DEFAULT_LOCALE): Promise<Cake[]> {
  const qs = (loc: Locale) =>
    ["filters[available][$eq]=true", "sort[0]=name:asc", "pagination[limit]=100", `locale=${loc}`].join("&");
  let data = await strapiGet<Cake[]>(`cakes?${qs(locale)}`);
  if ((!data || data.length === 0) && locale !== DEFAULT_LOCALE) {
    data = await strapiGet<Cake[]>(`cakes?${qs(DEFAULT_LOCALE)}`);
  }
  return data ?? [];
}

export async function getFeaturedCafes(limit = 8, locale: Locale = DEFAULT_LOCALE): Promise<Cafe[]> {
  const qs = (loc: Locale) =>
    [
      "filters[featured][$eq]=true",
      "filters[available][$eq]=true",
      "populate[image]=true",
      "populate[badge]=true",
      "sort[0]=name:asc",
      `pagination[limit]=${limit}`,
      `locale=${loc}`,
    ].join("&");
  let data = await strapiGet<Cafe[]>(`cafes?${qs(locale)}`);
  if ((!data || data.length === 0) && locale !== DEFAULT_LOCALE) {
    data = await strapiGet<Cafe[]>(`cafes?${qs(DEFAULT_LOCALE)}`);
  }
  return data ?? [];
}
