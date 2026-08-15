import { SectionComponent, type Cafe, type Cake, type GeneralInfoEntry, type Section } from "@/lib/strapi";
import { Hero } from "./blocks/Hero";
import { MediaText } from "./blocks/MediaText";
import { CakeGrid } from "./blocks/CakeGrid";
import { CafeGrid } from "./blocks/CafeGrid";
import { Quote } from "./blocks/Quote";
import { Gallery } from "./blocks/Gallery";
import { Text } from "./blocks/Text";
import { CtaCard } from "./blocks/CtaCard";
import { VenueInfo } from "./blocks/VenueInfo";
import { CardGrid } from "./blocks/CardGrid";
import { MapEmbed } from "./blocks/MapEmbed";
import { Form } from "./blocks/Form";

/**
 * Renders a page's dynamic zone: one block component per `__component`.
 * Add a new section type by creating `./blocks/<Name>.tsx` and a case here.
 */
export function Sections({
  sections,
  cakes,
  cafes,
  formCakes,
  cakePhone,
  reserveHref,
  generalInfo,
}: {
  sections: Section[];
  cakes: Cake[];
  cafes: Cafe[];
  /** All cakes — options for a Form's `cakes` (dropdown) field. */
  formCakes?: Cake[];
  cakePhone?: string;
  /** Site reservation link (header CTA href) — used by the café dialog's "Reserve a table" button. */
  reserveHref?: string;
  /** General Info single type — used by Card Grid cards with a `source` (address/hours/contact). */
  generalInfo?: GeneralInfoEntry;
}) {
  return (
    <>
      {sections.map((s) => {
        switch (s.__component) {
          case SectionComponent.Hero:
            return <Hero key={s.id} s={s} />;
          case SectionComponent.MediaText:
            return <MediaText key={s.id} s={s} />;
          case SectionComponent.CakeGrid:
            return <CakeGrid key={s.id} s={s} cakes={cakes} phone={cakePhone} />;
          case SectionComponent.CafeGrid:
            return <CafeGrid key={s.id} s={s} cafes={cafes} phone={cakePhone} reserveHref={reserveHref} />;
          case SectionComponent.Quote:
            return <Quote key={s.id} s={s} />;
          case SectionComponent.Gallery:
            return <Gallery key={s.id} s={s} />;
          case SectionComponent.Text:
            return <Text key={s.id} s={s} />;
          case SectionComponent.CtaCard:
            return <CtaCard key={s.id} s={s} />;
          case SectionComponent.VenueInfo:
            return <VenueInfo key={s.id} s={s} />;
          case SectionComponent.CardGrid:
            return <CardGrid key={s.id} s={s} generalInfo={generalInfo} />;
          case SectionComponent.Map:
            return <MapEmbed key={s.id} s={s} generalInfo={generalInfo} />;
          case SectionComponent.Form:
            return <Form key={s.id} s={s} cakes={formCakes} />;
          default:
            return null;
        }
      })}
    </>
  );
}
