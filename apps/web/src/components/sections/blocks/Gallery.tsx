import { Eyebrow, Image, Reveal, RevealVariant } from "@/components/ui";
import { media, GalleryColumns, GalleryLayout, TextAlign } from "@/lib/strapi";
import type { GallerySection } from "@/lib/strapi";
import { cn } from "@/lib/cn";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

// Images-per-row on desktop (chosen in the CMS). Always 2 on phones, stepping up
// so the grid never gets too cramped. Static strings so Tailwind can see them.
const COLUMN_CLASSES: Record<GalleryColumns, string> = {
  "2": "grid-cols-2",
  "3": "grid-cols-2 sm:grid-cols-3",
  "4": "grid-cols-2 md:grid-cols-4",
  "5": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  "6": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

// The "staggered" strip (the deployed Upstairs look): a fixed 4-up row where
// EVERY image is forced to the same portrait crop via object-cover, so the row
// is perfectly uniform no matter the source dimensions.
const STAGGER_ASPECT = "aspect-[3/4]";

/** A grid of photos; images-per-row and layout are set per gallery in the CMS. */
export function Gallery({ s }: { s: GallerySection }) {
  const images = s.images ?? [];
  const staggered = s.layout === GalleryLayout.Staggered;
  const columns = COLUMN_CLASSES[s.columns ?? GalleryColumns.Four];
  const centerHeader = (s.align ?? TextAlign.Left) === TextAlign.Center;
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="container-page py-20">
        {(s.eyebrow || s.heading) && (
          <div className={cn("mb-10", centerHeader ? "text-center" : "text-left")}>
            {s.eyebrow && <Eyebrow className="mb-3 block">{s.eyebrow}</Eyebrow>}
            {s.heading && (
              <h2 className="font-display-alt text-2xl font-semibold tracking-tight md:text-3xl">{s.heading}</h2>
            )}
          </div>
        )}
        {images.length > 0 && (
          <Reveal
            variant={RevealVariant.Stagger}
            className={cn("grid gap-3 sm:gap-4", staggered ? "grid-cols-2 md:grid-cols-4" : columns)}
          >
            {images.map((img, i) => {
              const src = media(img.url);
              if (!src) return null;
              const aspect = staggered ? STAGGER_ASPECT : "aspect-[4/3]";
              return (
                <figure key={`${img.url}-${i}`}>
                  <div className="group overflow-hidden rounded-sm">
                    <Image
                      src={src}
                      alt={img.alternativeText ?? s.heading ?? ""}
                      className={cn(
                        "w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]",
                        aspect,
                      )}
                    />
                  </div>
                  {s.showCaptions && img.caption && (
                    <figcaption className="mt-2 text-center font-ui text-small text-current/60">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
}
