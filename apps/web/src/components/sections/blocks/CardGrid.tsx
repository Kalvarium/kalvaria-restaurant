import { Clock, Info, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { Eyebrow, Reveal, RevealVariant } from "@/components/ui";
import { cn } from "@/lib/cn";
import type {
  CardBackground,
  CardGridSection,
  CardIcon,
  GeneralInfoEntry,
  InfoCard,
  OpeningHour,
  TextSize,
} from "@/lib/strapi";
import { TextAlign } from "@/lib/strapi";
import { SectionBackground, sectionBackground } from "@/lib/section-background";

// Card content text scale.
const CARD_TEXT: Record<TextSize, string> = {
  xsmall: "text-medium", // 14
  small: "text-regular", // 16
  medium: "text-large", // 18 (default)
  large: "text-subtitle", // 22
  xlarge: "text-title", // 24
  xxlarge: "text-hero", // 28
  xxxlarge: "text-2xl", // 32
};

const COLUMN_CLASSES: Record<NonNullable<CardGridSection["columns"]>, string> = {
  "2": "sm:grid-cols-2",
  "3": "md:grid-cols-3",
  "4": "grid-cols-2 lg:grid-cols-4",
};

// Adjustable card background (border + fill + coordinated text colour).
const CARD_BG: Record<CardBackground, string> = {
  white: "border-brown-900/[0.08] bg-white text-brown-900",
  cream: "border-brown-900/[0.08] bg-cream text-brown-900",
  green: "border-green-800 bg-green-800 text-cream",
  brown: "border-brown-900 bg-brown-900 text-cream",
};

// Lucide icon per the card's `icon` choice.
const ICONS: Record<Exclude<CardIcon, "none">, LucideIcon> = {
  location: MapPin,
  clock: Clock,
  phone: Phone,
  mail: Mail,
  info: Info,
};

const CardGlyph = ({ icon }: { icon: CardIcon }) => {
  if (icon === "none") return null;
  const Glyph = ICONS[icon];
  return (
    <div className="mb-5 flex text-rust-500">
      <Glyph size={28} strokeWidth={1.5} aria-hidden />
    </div>
  );
};

const GeneralInfoItem = ({
  label,
  valueClass,
  children,
}: {
  label: string;
  valueClass: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-rust-500">{label}</span>
    <span className={cn("font-accent", valueClass)}>{children}</span>
  </div>
);

/** A card's body: data pulled from General Info by `source`, at the card's text size. */
function CardBody({
  card,
  info,
  hours,
  labels,
}: {
  card: InfoCard;
  info?: GeneralInfoEntry;
  hours: OpeningHour[];
  labels: { cafe: string; cakes: string; email: string };
}) {
  const c = info?.contact;
  const text = CARD_TEXT[card.size ?? "medium"];
  switch (card.source) {
    case "address": {
      // Break the address into a line per comma-separated part.
      const lines = (c?.addressLine ?? "")
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
      return lines.length ? (
        <p className={cn("leading-[1.9]", text)}>
          {lines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ) : null;
    }
    case "hours":
      return (
        <div className="flex flex-col">
          {hours.map((h, i) => (
            <div
              key={h.id ?? i}
              className="flex items-center justify-between border-b border-current/15 py-2.5 last:border-0"
            >
              <span className="font-ui text-small font-medium text-current/70">{h.days}</span>
              <span className={cn("font-accent", text)}>{h.time}</span>
            </div>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="flex flex-col gap-4">
          {c?.cafePhone && (
            <GeneralInfoItem label={labels.cafe} valueClass={text}>
              <a href={`tel:${c.cafePhone}`}>{c.cafePhone}</a>
            </GeneralInfoItem>
          )}
          {c?.cakePhone && (
            <GeneralInfoItem label={labels.cakes} valueClass={text}>
              <a href={`tel:${c.cakePhone}`}>{c.cakePhone}</a>
            </GeneralInfoItem>
          )}
          {c?.email && (
            <GeneralInfoItem label={labels.email} valueClass={text}>
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </GeneralInfoItem>
          )}
        </div>
      );
    default:
      return null;
  }
}

/**
 * A responsive grid of Info Cards (icon + title + rich-text body). Each card is
 * its own CMS component; `highlight` renders the green treatment. Mirrors the
 * deployed `.contact-cards` layout, but reusable for any card row.
 */
export function CardGrid({ s, generalInfo }: { s: CardGridSection; generalInfo?: GeneralInfoEntry }) {
  const center = (s.align ?? TextAlign.Left) === TextAlign.Center;
  const columns = COLUMN_CLASSES[s.columns ?? "3"];
  const cards = s.cards ?? [];
  const labels = {
    cafe: s.cafeLabel ?? "Café",
    cakes: s.cakesLabel ?? "Cakes",
    email: s.emailLabel ?? "Email",
  };
  return (
    <section className={sectionBackground(s.background, SectionBackground.Surface)}>
      <div className="container-page py-20">
        <div className="mx-auto max-w-6xl">
        {(s.eyebrow || s.heading) && (
          <div className={cn("mb-8", center ? "text-center" : "text-left")}>
            {s.eyebrow && <Eyebrow className="mb-3 block">{s.eyebrow}</Eyebrow>}
            {s.heading && (
              <h2 className="font-display-alt text-5xl leading-[1.1] tracking-tight">
                {s.heading}
              </h2>
            )}
          </div>
        )}

        {cards.length > 0 && (
          <Reveal variant={RevealVariant.Stagger} className={cn("grid grid-cols-1 gap-6", columns)}>
            {cards.map((card, i) => (
              <div
                key={card.id ?? i}
                className={cn("border px-7 py-10 md:px-9 md:py-14", CARD_BG[card.background ?? "white"])}
              >
                <CardGlyph icon={card.icon ?? "none"} />
                {card.title && (
                  <div className="w-fit">
                    <h3 className="font-display-alt text-title">{card.title}</h3>
                    <div
                      aria-hidden
                      className={cn("mb-7 mt-4 h-0.5 w-full", card.background === "green" ? "bg-gold-500" : "bg-rust-500")}
                    />
                  </div>
                )}
                <CardBody card={card} info={generalInfo} hours={s.openingHours ?? []} labels={labels} />
                {card.note && <p className="mt-5 font-ui text-small italic text-current/50">{card.note}</p>}
              </div>
            ))}
          </Reveal>
        )}
        </div>
      </div>
    </section>
  );
}
