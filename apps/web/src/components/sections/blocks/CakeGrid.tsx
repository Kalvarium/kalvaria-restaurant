import { Button, ButtonVariant } from "@/components/ui";
import type { Cake, CakeGridSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";
import { CakeCard } from "./CakeCard";

export function CakeGrid({ s, cakes, phone }: { s: CakeGridSection; cakes: Cake[]; phone?: string }) {
  // Editor-curated cakes take priority; otherwise the featured list. Hide unavailable
  // ones (`price.available === false`).
  const items = (s.cakes && s.cakes.length > 0 ? s.cakes : cakes).filter((c) => c.price?.available !== false);
  const cta = s.ctaHeading || s.ctaButton;
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="container-page py-20">
        {items.length > 0 || cta ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <CakeCard
                key={c.id}
                cake={c}
                orderHref={s.ctaButton?.href}
                orderLabel={s.orderLabel}
                callLabel={s.callLabel}
                allergensLabel={s.allergensLabel}
                phone={phone}
              />
            ))}
            {cta && (
              // "Order a cake" card — the last grid cell (deployed .card-cta).
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
          <p className="text-center text-current/60">{s.emptyText ?? "We are currently preparing an offer."}</p>
        )}
      </div>
    </section>
  );
}
