import { List, ListItem, Reveal, RevealVariant } from "@/components/ui";
import type { VenueInfoSection } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";
import { RichBlocks } from "../RichBlocks";

/**
 * Two-column "space information" section (the deployed `.two-col` + `.venue-info-card`):
 * left = intro prose + an em-dash feature list; right = a green card with a
 * label/value spec table. Mirrors the Upstairs page's Space Information block.
 */
export function VenueInfo({ s }: { s: VenueInfoSection }) {
  const hasCard = !!s.cardHeading || (s.rows?.length ?? 0) > 0;
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="container-page py-20">
        <Reveal
          variant={RevealVariant.Up}
          className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-20"
        >
          {/* left — intro prose + feature list */}
          <div>
            <RichBlocks blocks={s.body} />
            {s.features && s.features.length > 0 && (
              <List className="mt-5">
                {s.features.map((f) => (
                  <ListItem key={f.id ?? f.text}>{f.text}</ListItem>
                ))}
              </List>
            )}
          </div>

          {/* right — info card */}
          {hasCard && (
            <div className="rounded-sm bg-green-800 p-8 text-cream md:p-10">
              {s.cardHeading && (
                <h3 className="mb-7 border-b border-cream/20 pb-4 font-display-alt text-xl">{s.cardHeading}</h3>
              )}
              {s.rows && s.rows.length > 0 && (
                <table className="w-full">
                  <tbody>
                    {s.rows.map((r) => (
                      <tr key={r.id ?? r.label} className="border-b border-cream/10 last:border-0">
                        <td className="w-[120px] py-3.5 pt-4 align-top font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-400">
                          {r.label}
                        </td>
                        <td className="py-3.5 text-[17px]">{r.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
