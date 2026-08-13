import { Button, ButtonVariant, Eyebrow, Reveal, RevealVariant } from "@/components/ui";
import { TextSize, type CtaCardSection } from "@/lib/strapi";
import { cn } from "@/lib/cn";
import { SectionBackground, sectionBackground } from "@/lib/section-background";
import { RichBlocks } from "../RichBlocks";

/**
 * A contained call-to-action card: a text column (eyebrow + heading + body) on
 * the left and a button on the right, set inside a coloured card panel on a
 * coloured section band. Both the section background and the card background are
 * author-selectable; text colour is derived from each (via `sectionBackground`)
 * so light and dark grounds read correctly.
 */
export function CtaCard({ s }: { s: CtaCardSection }) {
  return (
    <section className={sectionBackground(s.background, SectionBackground.Cream)}>
      <div className="container-page py-20">
        {s.topDivider && <div className="mb-16 h-px bg-current/10" />}
        <Reveal
          variant={RevealVariant.Up}
          className={cn(
            "flex flex-col gap-8 p-10 md:flex-row md:items-center md:justify-between md:gap-12 md:p-14",
            sectionBackground(s.cardBackground, SectionBackground.Green),
          )}
        >
          <div>
            {s.eyebrow && <Eyebrow className="mb-3 block text-gold-500!">{s.eyebrow}</Eyebrow>}
            {s.heading && (
              <h2 className="font-display-alt text-3xl leading-[1.15] tracking-tight md:text-4xl">
                {s.heading}
              </h2>
            )}
            {s.body && <RichBlocks blocks={s.body} size={s.bodySize ?? TextSize.Small} className="mt-4" />}
          </div>
          {s.button && (
            <div className="shrink-0">
              <Button variant={s.button.variant ?? ButtonVariant.Primary} href={s.button.href}>
                {s.button.label}
              </Button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
