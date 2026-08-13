"use client";

import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  Badge,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardDescription,
  CardMedia,
  CardTitle,
  CardVariant,
  Dialog,
  DialogOverlay,
  Icon,
  Image,
} from "@/components/ui";
import { media, type Cafe } from "@/lib/strapi";

/** First sentence only — text up to and including the first period. */
const firstSentence = (text: string) => {
  const i = text.indexOf(".");
  return (i === -1 ? text : text.slice(0, i + 1)).trim();
};

/** Comma-separated (as typed in Strapi) → middot-separated, e.g. "a, b" → "a · b". */
const dotList = (text: string) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" · ");

/** e.g. `from €2.80/cup`, `€4.5`, `28 CZK` — prefix + amount + unit suffix. */
const formatPrice = (price: number, currency: string, prefix?: string, unit?: string) => {
  const amount = Number.isInteger(price) ? String(price) : String(price);
  const money = currency === "EUR" ? `€${amount}` : `${amount} ${currency}`;
  return `${prefix ? `${prefix} ` : ""}${money}${unit ?? ""}`;
};

export interface CafeCardProps {
  cafe: Cafe;
  /** Where the dialog's "Reserve a table" button links (the site reservation link). */
  reserveHref?: string;
  /** Localized dialog labels (from the Cafe Grid section). */
  reserveLabel?: string;
  callLabel?: string;
  favoriteLabel?: string;
  /** Phone number for the dialog's "Call" action (contact.cakePhone). */
  phone?: string;
}

/**
 * A café-menu card that opens a two-column detail dialog on click — the same
 * layout as the cake dialog, but with a "favorite" note in place of allergens.
 * Open state, Esc-to-close and scroll-lock live here (the call site).
 */
export function CafeCard({ cafe, reserveHref, reserveLabel, callLabel, favoriteLabel, phone }: CafeCardProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const img = media(cafe.image?.[0]?.url) ?? "";
  const alt = cafe.image?.[0]?.alternativeText ?? cafe.name;
  const badge = cafe.badge ? { label: cafe.badge.label, variant: cafe.badge.variant } : undefined;
  const price = formatPrice(cafe.price, cafe.currency, cafe.pricePrefix, cafe.priceUnit);

  // Shared click-to-open behaviour for the standard and wide tiles.
  const openProps = {
    role: "button" as const,
    tabIndex: 0,
    "aria-haspopup": "dialog" as const,
    onClick: () => setOpen(true),
    onKeyDown: (e: ReactKeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
    },
  };

  return (
    <>
      {cafe.wide ? (
        // Wide overlay tile — 16:9 image with a title-only gradient overlay, spans 2 columns.
        <Card
          variant={CardVariant.Surface}
          {...openProps}
          className="group cursor-pointer text-left transition duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 sm:col-span-2"
        >
          <CardMedia
            image={img}
            imageAlt={alt}
            aspect="16/9"
            zoom
            overlay={
              <h3 className="font-display-alt text-[clamp(20px,2.5vw,26px)] font-bold text-cream [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]">
                {cafe.name}
              </h3>
            }
          />
        </Card>
      ) : (
        <Card
          variant={CardVariant.Surface}
          {...openProps}
          className="cursor-pointer text-left transition duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500"
        >
          <CardMedia image={img} imageAlt={alt} badge={badge} />
          <CardBody>
            <CardTitle>{cafe.name}</CardTitle>
            {cafe.description && <CardDescription>{firstSentence(cafe.description)}</CardDescription>}
          </CardBody>
        </Card>
      )}

      {open && (
        <DialogOverlay onClick={() => setOpen(false)} className="animate-dialog-overlay">
          <Dialog
            role="dialog"
            aria-modal="true"
            aria-label={cafe.name}
            className="animate-dialog-panel relative max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close ✕ */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-brown-900 transition duration-300 hover:rotate-90 hover:bg-brown-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500"
            >
              <Icon name="close" size={22} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* left — image */}
              <div className="relative aspect-[4/3] md:aspect-auto">
                {img && <Image src={img} alt={alt} className="absolute inset-0 h-full w-full object-cover" />}
              </div>

              {/* right — info */}
              <div className="flex flex-col gap-4 overflow-y-auto p-8 md:p-10">
                {badge && (
                  <Badge variant={badge.variant} className="self-start">
                    {badge.label}
                  </Badge>
                )}
                <div className="flex flex-col gap-1 pr-8">
                  <h2 className="font-display-alt text-2xl font-bold leading-[1.1]">{cafe.name}</h2>
                  {cafe.description && (
                    <p className="text-large leading-[1.75] text-color-brown-900/75">{cafe.description}</p>
                  )}
                </div>

                <hr className="border-line" />
                <p className="font-display-alt text-hero text-rust-500 font-bold">{price}</p>

                {cafe.favorite && (
                  <>
                    <hr className="border-line" />
                    <div className="flex flex-col gap-1">
                      <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.1em] text-rust-500">
                        {favoriteLabel ?? "Favorite"}
                      </span>
                      <span className="text-regular text-color-brown-900">{dotList(cafe.favorite)}</span>
                    </div>
                  </>
                )}

                {(reserveHref || phone) && (
                  <div className="mt-2 flex flex-wrap gap-4">
                    {reserveHref && (
                      <Button variant={ButtonVariant.Primary} href={reserveHref} className="flex-1 whitespace-nowrap">
                        {reserveLabel ?? "Reserve a table"}
                      </Button>
                    )}
                    {phone && (
                      <Button variant={ButtonVariant.Secondary} href={`tel:${phone}`} className="flex-1 whitespace-nowrap">
                        {callLabel ?? "Call"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Dialog>
        </DialogOverlay>
      )}
    </>
  );
}
