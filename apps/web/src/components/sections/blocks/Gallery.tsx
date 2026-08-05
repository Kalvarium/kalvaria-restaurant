import { Image, Reveal, RevealVariant } from "@/components/ui";
import { media } from "@/lib/strapi";
import type { GallerySection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

/** A grid of photos (e.g. 8 images → 2 rows of 4 on desktop, 2 columns on mobile). */
export function Gallery({ s }: { s: GallerySection }) {
  const images = s.images ?? [];
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        {s.heading && (
          <div className="mb-10 text-center">
            <h2 className="font-display-alt text-[clamp(28px,4vw,40px)] font-semibold tracking-tight">{s.heading}</h2>
          </div>
        )}
        {images.length > 0 && (
          <Reveal variant={RevealVariant.Stagger} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {images.map((img, i) => {
              const src = media(img.url);
              if (!src) return null;
              return (
                <Image
                  key={`${img.url}-${i}`}
                  src={src}
                  alt={img.alternativeText ?? s.heading ?? ""}
                  className="aspect-square w-full rounded-sm object-cover shadow-card"
                />
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
}
