import { SectionComponent, type Cake, type Section } from "@/lib/strapi";
import { Hero } from "./blocks/Hero";
import { MediaText } from "./blocks/MediaText";
import { FeatureCards } from "./blocks/FeatureCards";
import { CakeGrid } from "./blocks/CakeGrid";
import { ReservationCta } from "./blocks/ReservationCta";
import { Quote } from "./blocks/Quote";
import { Gallery } from "./blocks/Gallery";

/**
 * Renders a page's dynamic zone: one block component per `__component`.
 * Add a new section type by creating `./blocks/<Name>.tsx` and a case here.
 */
export function Sections({ sections, cakes }: { sections: Section[]; cakes: Cake[] }) {
  return (
    <>
      {sections.map((s) => {
        switch (s.__component) {
          case SectionComponent.Hero:
            return <Hero key={s.id} s={s} />;
          case SectionComponent.MediaText:
            return <MediaText key={s.id} s={s} />;
          case SectionComponent.FeatureCards:
            return <FeatureCards key={s.id} s={s} />;
          case SectionComponent.CakeGrid:
            return <CakeGrid key={s.id} s={s} cakes={cakes} />;
          case SectionComponent.ReservationCta:
            return <ReservationCta key={s.id} s={s} />;
          case SectionComponent.Quote:
            return <Quote key={s.id} s={s} />;
          case SectionComponent.Gallery:
            return <Gallery key={s.id} s={s} />;
          default:
            return null;
        }
      })}
    </>
  );
}
