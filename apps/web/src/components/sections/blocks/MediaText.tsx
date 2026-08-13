import { Eyebrow, Image, Reveal, RevealVariant } from "@/components/ui";
import { media } from "@/lib/strapi";
import type { Block, MediaTextSection } from "@/lib/strapi";
import { cn } from "@/lib/cn";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

/** Minimal renderer for Strapi "blocks" rich text (paragraphs), set in the serif body face. */
function Blocks({ blocks }: { blocks?: Block[] }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((b, i) =>
        b.type === "paragraph" ? (
          <p key={i} className="font-accent text-xl leading-[1.75] text-current">
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
  const alt = s.image?.alternativeText ?? s.heading ?? "";

  const text = (
    <>
      {s.eyebrow && <Eyebrow className="mb-4 block">{s.eyebrow}</Eyebrow>}
      {s.heading && (
        <h2 className="mb-6 font-display-alt text-3xl font-bold leading-tight tracking-tight">{s.heading}</h2>
      )}
      <div className="flex flex-col gap-4">
        <Blocks blocks={s.body} />
      </div>
    </>
  );

  // Full-bleed band: edge-to-edge, two equal columns, no gap — a coloured text
  // panel beside a height-filling image (the deployed `.terrace-feature`).
  if (s.variant === "full") {
    return (
      <section className={sectionBackground(s.background, SectionBackground.Green)}>
        <div className="grid items-stretch md:grid-cols-2">
          {img && (
            <Reveal
              variant={right ? RevealVariant.Right : RevealVariant.Left}
              className={cn(right ? "md:order-2" : "md:order-1")}
            >
              {/* Natural size — the image drives the band's height; the text panel matches it. */}
              <Image src={img} alt={alt} className="block h-auto w-full" />
            </Reveal>
          )}
          <Reveal
            variant={RevealVariant.Up}
            className={cn(
              "flex flex-col justify-center px-6 py-12 sm:px-10 md:p-14 lg:p-16",
              right ? "md:order-1" : "md:order-2",
            )}
          >
            {text}
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="container-page grid items-center gap-12 py-24 md:grid-cols-2">
        {img && (
        <Reveal
          variant={right ? RevealVariant.Right : RevealVariant.Left}
          className={right ? "md:order-2" : "md:order-1"}
        >
          <figure>
            <Image
              src={img}
              alt={alt}
              className="aspect-[4/3] w-full rounded-sm object-cover shadow-card"
            />
            {s.showCaption && s.image?.caption && (
              <figcaption className="mt-3 font-cormorant text-medium text-current/60">{s.image.caption}</figcaption>
            )}
          </figure>
        </Reveal>
      )}
      <Reveal variant={RevealVariant.Up} className={right ? "md:order-1" : "md:order-2"}>
        {text}
      </Reveal>
      </div>
    </section>
  );
}
