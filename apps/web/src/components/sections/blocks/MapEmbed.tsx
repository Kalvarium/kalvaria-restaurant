import type { GeneralInfoEntry, MapSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

/**
 * A full-width embedded map. The URL comes from General Info (`contact.mapUrl`) —
 * set once centrally. Must be a Google Maps *embed* URL (Share → Embed a map → the
 * iframe `src`).
 */
export function MapEmbed({ s, generalInfo }: { s: MapSection; generalInfo?: GeneralInfoEntry }) {
  const src = generalInfo?.contact?.mapUrl;
  if (!src) return null;
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <iframe
        src={src}
        title="Map"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block h-[420px] w-full border-0 md:h-[480px]"
      />
    </section>
  );
}
