import { Button, ButtonVariant, Eyebrow } from "@/components/ui";
import { media } from "@/lib/strapi";
import type { HeroSection, Scrim } from "@/lib/strapi";

const scrimBg: Record<Scrim, string> = {
  strong: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.5) 100%)",
  medium: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.3) 100%)",
  light: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.15) 100%)",
};

export function Hero({ s }: { s: HeroSection }) {
  const bg = media(s.background?.url);
  return (
    <section
      className="relative flex min-h-screen items-end text-cream"
      style={
        bg
          ? {
              backgroundImage: `${scrimBg[s.scrim ?? "medium"]}, url("${bg}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: "#2b2421" }
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-5 px-[clamp(20px,5vw,80px)] pb-8 text-left sm:pb-10 lg:pb-20">
        {s.eyebrow && (
          <Eyebrow className="animate-fade-up text-gold-400" style={{ animationDelay: "0.1s" }}>
            {s.eyebrow}
          </Eyebrow>
        )}
        <h1
          className="animate-fade-up font-display text-[clamp(52px,10vw,104px)] leading-[0.95] tracking-[0.8px]"
          style={{ animationDelay: "0.2s" }}
        >
          {s.title}
        </h1>
        {s.subtitle && (
          <p
            className="animate-fade-up max-w-[42ch] font-accent text-[clamp(20px,2.4vw,26px)] text-cream/90"
            style={{ animationDelay: "0.35s" }}
          >
            {s.subtitle}
          </p>
        )}
        {s.ctas && s.ctas.length > 0 && (
          <div className="animate-fade-up mt-3 flex flex-wrap gap-4" style={{ animationDelay: "0.5s" }}>
            {s.ctas.map((c) => (
              <Button key={c.href + c.label} variant={c.variant ?? ButtonVariant.Primary} href={c.href}>
                {c.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
