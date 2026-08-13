import { Button, ButtonVariant, Eyebrow, Reveal, RevealVariant } from "@/components/ui";
import { TextAlign, TextSize, type TextContentData, type TextSection } from "@/lib/strapi";
import { cn } from "@/lib/cn";
import { SectionBackground, sectionBackground } from "@/lib/section-background";
import { RichBlocks } from "../RichBlocks";

// Heading font size per `size` (body prose is scaled inside RichBlocks).
const HEADING_SIZE: Record<TextSize, string> = {
  xsmall: "text-large", // 18
  small: "text-subtitle", // 22
  medium: "text-heading", // 26 (default)
  large: "text-2xl", // 32
  xlarge: "text-3xl", // 40
  xxlarge: "text-4xl", // 48
  xxxlarge: "text-5xl", // 64
};

/**
 * Just the inner content of a Text block (eyebrow → heading → prose → button),
 * with no section wrapper/background. Used by the Text section and anywhere a
 * Text can be embedded (e.g. the Form panel).
 */
export function TextContent({
  s,
  className,
  bodyClassName = "max-w-xl",
}: {
  s: TextContentData;
  className?: string;
  /** Width/utility classes for the prose body (default caps at max-w-xl for readability). */
  bodyClassName?: string;
}) {
  const titleSize = s.titleSize ?? TextSize.Medium;
  const bodySize = s.bodySize ?? TextSize.Medium;
  return (
    <div className={className}>
      {s.eyebrow && <Eyebrow className="mb-3 block">{s.eyebrow}</Eyebrow>}
      {s.heading && (
        <h2 className={cn("mb-6 font-display-alt leading-[1.2] tracking-tight", HEADING_SIZE[titleSize])}>
          {s.heading}
        </h2>
      )}
      <RichBlocks blocks={s.body} size={bodySize} className={bodyClassName} />
      {s.button?.label && (
        <div className="mt-8">
          <Button variant={s.button.variant ?? ButtonVariant.Primary} href={s.button.href}>
            {s.button.label}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * General-purpose text block: optional eyebrow + heading over formatted prose.
 * `center` → a width-capped section intro; `left` (default) → a prose column.
 * `size` scales the heading + body prose. Matches the site's common text
 * pattern (Jost eyebrow → Playfair heading → Cormorant body).
 */
export function Text({ s }: { s: TextSection }) {
  const center = s.align === TextAlign.Center;
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      {/* container-page = same left/right edges as the hero. The inner column is
          width-capped for readability: left-aligned (flush to the hero edge) or
          centred for a section intro. */}
      <div className="container-page py-20">
        {s.topDivider && <div className="mb-16 h-px bg-current/10" />}
        <Reveal variant={RevealVariant.Up} className={cn(center ? "mx-auto text-center" : "")}>
          <TextContent s={s} />
        </Reveal>
      </div>
    </section>
  );
}
