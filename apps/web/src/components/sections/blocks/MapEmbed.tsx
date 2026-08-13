import type { MapSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

/** A full-width embedded map (Google Maps embed URL). */
export function MapEmbed({ s }: { s: MapSection }) {
  if (!s.embedUrl) return null;
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <iframe
        src={s.embedUrl}
        title="Map"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block h-[420px] w-full border-0 md:h-[480px]"
      />
    </section>
  );
}
