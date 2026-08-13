import { Reveal, RevealVariant } from "@/components/ui";
import type { QuoteSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

export function Quote({ s }: { s: QuoteSection }) {
  return (
    <section
      className={`${sectionBackground(s.background, SectionBackground.Green)} px-6 py-28 text-center sm:py-[152px] lg:py-[180px]`}
    >
      <Reveal variant={RevealVariant.Up} className="mx-auto max-w-4xl">
        <blockquote className="font-display-alt text-2xl font-semibold italic leading-snug">
          &ldquo;{s.quote}&rdquo;
        </blockquote>
        {s.author && (
          <p className="mt-8 font-ui text-small font-semibold text-gold-500">
            &mdash; {s.author}
          </p>
        )}
      </Reveal>
    </section>
  );
}
