import { Italiana, Playfair_Display, Jost, Cormorant_Garamond } from "next/font/google";

/**
 * Brand fonts, self-hosted via next/font (mirrors design/tokens/tokens.css).
 * Each exposes a CSS variable consumed by the Tailwind theme in globals.css:
 *   Italiana           → --font-italiana   → --font-display     (hero headings — "Kalvárium 1910")
 *   Playfair Display   → --font-playfair   → --font-display-alt (H2/H3 headings)
 *   Cormorant Garamond → --font-cormorant  → --font-accent      (regular / body text, quotes)
 *   Jost               → --font-jost       → --font-ui          (navigation, buttons, labels)
 */

// Hero headings — Italiana (static, single weight; "latin" covers á in Kalvárium)
export const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
  display: "swap",
});

// H2 / H3 headings — Playfair Display (variable)
export const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

// Navigation, buttons & labels — Jost (variable)
export const jost = Jost({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jost",
  display: "swap",
});

// Regular / body text & pull-quotes — Cormorant Garamond (static, incl. italic)
export const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-cormorant",
  display: "swap",
});

/** All font CSS-variable classes, to apply on the root <html> element. */
export const fontVariables = [
  italiana.variable,
  playfair.variable,
  jost.variable,
  cormorant.variable,
].join(" ");
