/**
 * Named section backgrounds, selectable per section instance in the CMS.
 * Each maps to a design-token background plus a coordinated text colour, so a
 * section reads correctly whether it sits on a light or dark ground.
 */
export const SectionBackground = {
  Surface: "surface",
  Cream: "cream",
  Green: "green",
  Brown: "brown",
} as const;
export type SectionBackground = (typeof SectionBackground)[keyof typeof SectionBackground];

const CLASSES: Record<SectionBackground, string> = {
  surface: "bg-surface text-brown-900",
  cream: "bg-cream text-brown-900",
  green: "bg-green-800 text-cream",
  brown: "bg-brown-900 text-cream",
};

/**
 * Wrapper classes (background + base text colour) for a section. `value` is the
 * CMS choice; when unset it falls back to the block's natural default, so
 * existing content keeps its look until an editor overrides it.
 */
export function sectionBackground(
  value: SectionBackground | undefined | null,
  fallback: SectionBackground,
): string {
  return CLASSES[value ?? fallback];
}
