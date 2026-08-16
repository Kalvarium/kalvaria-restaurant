import { Button, ButtonVariant, Eyebrow } from "@/components/ui";
import { HeroSize, HeroTextWidth, media } from "@/lib/strapi";
import type { HeroSection, Scrim } from "@/lib/strapi";

const scrimBg: Record<Scrim, string> = {
  none: "",
  strong: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.5) 100%)",
  medium: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.3) 100%)",
  light: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.15) 100%)",
};

// Full-screen (home) vs the shorter interior-page heroes (matches the deployed
// .hero / .hero-tall / .hero--short height variants).
const heroHeight: Record<HeroSize, string> = {
  full: "min-h-screen",
  tall: "min-h-[clamp(380px,50vw,600px)]",
  short: "min-h-[clamp(320px,40vw,480px)]",
};

// Text-column max width — set per hero so each page can size its headline block.
const heroTextWidth: Record<HeroTextWidth, string> = {
  sm: "max-w-md", // 28rem
  md: "max-w-xl", // 36rem (default)
  lg: "max-w-2xl", // 42rem
  xl: "max-w-3xl", // 48rem
  full: "max-w-none",
};

export function Hero({ s }: { s: HeroSection }) {
  const bg = media(s.background?.url);
  const scrim = scrimBg[s.scrim ?? "medium"];
  return (
    <section
      className={`relative flex items-end bg-[position:22%_center] text-cream sm:bg-[position:center] ${heroHeight[s.size ?? HeroSize.Full]}`}
      style={
        bg
          ? {
              backgroundImage: scrim ? `${scrim}, url("${bg}")` : `url("${bg}")`,
              backgroundSize: "cover",
            }
          : { background: "#2b2421" }
      }
    >
      <div className="container-page pb-32 text-left sm:pb-36 lg:pb-52">
        <div className={`flex ${heroTextWidth[s.textWidth ?? HeroTextWidth.Md]} flex-col items-start gap-5`}>
        {s.eyebrow && (
          <Eyebrow className="animate-fade-up text-gold-400" style={{ animationDelay: "0.1s" }}>
            {s.eyebrow}
          </Eyebrow>
        )}
        {s.title && (
          <h1
            className="animate-fade-up font-display font-bold text-4xl leading-[1.05] tracking-[0.8px] sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.2s" }}
          >
            {s.title}
          </h1>
        )}
        {s.subtitle && (
          <p
            className="animate-fade-up max-w-[42ch] font-semibold font-accent text-subtitle text-cream/90"
            style={{ animationDelay: "0.35s" }}
          >
            {s.subtitle}
          </p>
        )}
        {s.ctas && s.ctas.length > 0 && (
          <div className="animate-fade-up mt-3 flex flex-wrap gap-4" style={{ animationDelay: "0.5s" }}>
            {s.ctas.map((c) => (
              <Button key={c.href + c.label} variant={c.variant ?? ButtonVariant.Primary} href={c.href} className="py-4">
                {c.label}
              </Button>
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
