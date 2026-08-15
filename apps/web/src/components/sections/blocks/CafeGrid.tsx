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
  // ones (`price.available === false`).
  const source = (s.cafes && s.cafes.length > 0 ? s.cafes : cafes).filter((c) => c.price?.available !== false);
  // Wide tiles are full-width overlay banners — keep them at the end of the grid.
  const items = [...source].sort((a, b) => Number(a.wide ?? false) - Number(b.wide ?? false));
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="container-page py-20">
        {items.length > 0 ? (
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
          </div>
        ) : (
          <p className="text-center text-current/60">{s.emptyText ?? "We are currently preparing our menu."}</p>
        )}
      </div>
    </section>
  );
}
