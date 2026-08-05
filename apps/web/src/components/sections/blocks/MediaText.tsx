import { Eyebrow, Image, Reveal, RevealVariant } from "@/components/ui";
import { media } from "@/lib/strapi";
import type { Block, MediaTextSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

/** Minimal renderer for Strapi "blocks" rich text (paragraphs), set in the serif body face. */
function Blocks({ blocks }: { blocks?: Block[] }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((b, i) =>
        b.type === "paragraph" ? (
          <p key={i} className="font-accent text-[clamp(18px,2vw,21px)] leading-relaxed text-current/80">
            {(b.children ?? []).map((c) => c.text).join("")}
          </p>
        ) : null,
      )}
    </>
  );
}

export function MediaText({ s }: { s: MediaTextSection }) {
  const img = media(s.image?.url);
  const right = s.imageSide !== "left";
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 sm:px-8 md:grid-cols-2">
        {img && (
        <Reveal
          variant={right ? RevealVariant.Right : RevealVariant.Left}
          className={right ? "md:order-2" : "md:order-1"}
        >
          <Image
            src={img}
            alt={s.image?.alternativeText ?? s.heading ?? ""}
            className="aspect-[4/3] w-full rounded-sm object-cover shadow-card"
          />
        </Reveal>
      )}
      <Reveal variant={RevealVariant.Up} className={right ? "md:order-1" : "md:order-2"}>
        {s.eyebrow && <Eyebrow className="mb-4 block">{s.eyebrow}</Eyebrow>}
        {s.heading && (
          <h2 className="mb-6 font-display-alt text-[clamp(30px,4.5vw,44px)] font-semibold leading-tight tracking-tight">
            {s.heading}
          </h2>
        )}
        <div className="flex flex-col gap-4">
          <Blocks blocks={s.body} />
        </div>
      </Reveal>
      </div>
    </section>
  );
}
