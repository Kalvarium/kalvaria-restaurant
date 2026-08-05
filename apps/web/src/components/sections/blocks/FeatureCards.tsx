import Link from "next/link";
import { Icon, Image, Reveal, RevealVariant } from "@/components/ui";
import { media } from "@/lib/strapi";
import type { FeatureCardsSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

export function FeatureCards({ s }: { s: FeatureCardsSection }) {
  return (
    <section className={sectionBackground(s.background, SectionBackground.Cream)}>
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        {s.heading && (
          <Reveal variant={RevealVariant.Up}>
            <h2 className="mb-12 text-center font-display-alt text-[clamp(30px,4.5vw,44px)] font-semibold tracking-tight">
              {s.heading}
            </h2>
          </Reveal>
        )}
        <Reveal variant={RevealVariant.Stagger} className="grid gap-10 md:grid-cols-3">
          {s.cards?.map((c) => {
            const img = media(c.image?.url);
            return (
              <article key={c.id ?? c.title} className="flex flex-col overflow-hidden border border-line bg-white">
                {img && (
                  // Natural aspect ratio; width/height reserve the layout space so the image
                  // keeps its intrinsic ratio and doesn't glitch on a soft refresh (locale switch).
                  <Image
                    src={img}
                    alt={c.title}
                    width={c.image?.width}
                    height={c.image?.height}
                    className="block h-auto w-full object-cover"
                  />
                )}
                <div className="px-7 pt-7 pb-8">
                  {c.eyebrow && (
                    <p className="font-ui text-[12px] font-semibold uppercase tracking-[1.65px] text-rust-500">
                      {c.eyebrow}
                    </p>
                  )}
                  <h3 className="mt-3 font-display-alt text-[26px] font-semibold leading-tight tracking-tight">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="mt-3 font-accent text-[19px] leading-relaxed text-brown-900/70">
                      {c.description}
                    </p>
                  )}
                  {c.linkLabel && (
                    <Link
                      href={c.linkHref ?? "#"}
                      className="group mt-5 inline-flex items-center gap-2 font-ui text-[12px] font-semibold uppercase tracking-[1.3px] text-rust-500"
                    >
                      {c.linkLabel}
                      <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
