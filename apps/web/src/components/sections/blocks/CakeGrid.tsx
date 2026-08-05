import { Button, ButtonSize, ButtonVariant, ProductCard } from "@/components/ui";
import { media } from "@/lib/strapi";
import type { Cake, CakeGridSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

const formatPrice = (price: number, currency: string) => {
  const n = price.toFixed(2).replace(".", ",");
  return currency === "EUR" ? `${n} €` : `${n} ${currency}`;
};

export function CakeGrid({ s, cakes }: { s: CakeGridSection; cakes: Cake[] }) {
  const items = cakes.slice(0, s.limit ?? 6);
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <div className="mb-10 text-center">
          {s.heading && (
            <h2 className="font-display-alt text-[clamp(28px,4vw,40px)] font-semibold tracking-tight">{s.heading}</h2>
          )}
          {s.intro && <p className="mx-auto mt-2 max-w-[52ch] text-[16px] text-current/70">{s.intro}</p>}
        </div>
      {items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <ProductCard
              key={c.id}
              image={media(c.image?.[0]?.url) ?? ""}
              imageAlt={c.image?.[0]?.alternativeText ?? c.name}
              title={c.name}
              description={c.description ?? ""}
              price={formatPrice(c.price, c.currency)}
              badge={c.badge ? { label: c.badge.label, variant: c.badge.variant } : undefined}
              action={
                <Button variant={ButtonVariant.Primary} size={ButtonSize.Sm} href="#rezervacia">
                  Order
                </Button>
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-current/60">We are currently preparing an offer.</p>
      )}
      </div>
    </section>
  );
}
