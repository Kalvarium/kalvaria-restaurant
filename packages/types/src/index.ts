/**
 * Shared TypeScript types for the Kalvaria monorepo.
 *
 * These describe the shapes the web app consumes from the Strapi CMS.
 * Expand these as content types are modeled in `apps/cms`.
 */

/** A single item on the restaurant menu, as exposed by the CMS. */
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  /** Price in the smallest currency unit (e.g. cents). */
  priceCents: number;
  category: MenuCategory;
  available: boolean;
}

export type MenuCategory =
  | "starter"
  | "main"
  | "dessert"
  | "drink";
