import { Button, ButtonVariant } from "@/components/ui";
import type { Cafe, CafeGridSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";
import { CafeCard } from "./CafeCard";

export function CafeGrid({
  s,
  cafes,
  phone,
  reserveHref,
}: {
  s: CafeGridSection;
  cafes: Cafe[];
  phone?: string;
  reserveHref?: string;
}) {
  // Editor-curated items take priority; otherwise the featured list. Hide unavailable
  // ones (the fallback list is pre-filtered, but curated picks aren't).
  const source = (s.cafes && s.cafes.length > 0 ? s.cafes : cafes).filter((c) => c.available !== false);
  // Wide tiles are full-width overlay banners — keep them at the end of the grid.
  const items = source
    .slice(0, s.limit ?? 8)
    .sort((a, b) => Number(a.wide ?? false) - Number(b.wide ?? false));
  const cta = s.ctaHeading || s.ctaButton;
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="container-page py-20">
        <div className="mb-10">
          {s.heading && (
            <h2 className="font-display-alt text-2xl font-semibold tracking-tight md:text-3xl">{s.heading}</h2>
          )}
          {s.intro && <p className="mt-2 max-w-[52ch] text-regular text-current/70">{s.intro}</p>}
        </div>
        {items.length > 0 || cta ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((c) => (
              <CafeCard
                key={c.id}
                cafe={c}
                reserveHref={reserveHref}
                reserveLabel={s.reserveLabel}
                callLabel={s.callLabel}
                favoriteLabel={s.favoriteLabel}
                phone={phone}
              />
            ))}
            {cta && (
              <div className="flex flex-col justify-center gap-4 bg-green-800 px-8 py-10 text-cream">
                {s.ctaHeading && <h3 className="font-display-alt text-title">{s.ctaHeading}</h3>}
                {s.ctaBody && <p className="text-large leading-[1.6] text-cream/80">{s.ctaBody}</p>}
                {s.ctaButton && (
                  <Button variant={ButtonVariant.Primary} href={s.ctaButton.href} className="mt-2">
                    {s.ctaButton.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-current/60">{s.emptyText ?? "We are currently preparing our menu."}</p>
        )}
      </div>
    </section>
  );
}
