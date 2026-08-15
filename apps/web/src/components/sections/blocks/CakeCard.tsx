"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardDescription,
  CardMedia,
  CardTitle,
  Dialog,
  DialogOverlay,
  Icon,
  Image,
} from "@/components/ui";
import { media, type Cake } from "@/lib/strapi";
import { formatPrice } from "@/lib/price";
import { openCakeOrder } from "@/lib/cake-order";

/** First sentence only — text up to and including the first period. */
const firstSentence = (text: string) => {
  const i = text.indexOf(".");
  return (i === -1 ? text : text.slice(0, i + 1)).trim();
};

export interface CakeCardProps {
  cake: Cake;
  /** Where the dialog's "Order" button links (from the grid's CTA button). */
  orderHref?: string;
  /** Localized dialog labels (from the Cake Grid section). */
  orderLabel?: string;
  callLabel?: string;
  allergensLabel?: string;
  /** Phone number for the dialog's "Call" action (contact.cakePhone). */
  phone?: string;
}

/**
 * A cake card that opens a two-column detail dialog on click (image left, info
 * right). The card and dialog are composed from the `Card` / `Dialog` primitives;
 * open state, Esc-to-close and scroll-lock live here (the call site).
 */
export function CakeCard({ cake, orderHref, orderLabel, callLabel, allergensLabel, phone }: CakeCardProps) {
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

  const img = media(cake.image?.[0]?.url) ?? "";
  const alt = cake.image?.[0]?.alternativeText ?? cake.name;
  const badge = cake.badge ? { label: cake.badge.label, variant: cake.badge.variant } : undefined;
  const price = formatPrice(cake.price, cake.currency, cake.pricePrefix, cake.priceUnit);

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="cursor-pointer text-left transition duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500"
      >
        <CardMedia image={img} imageAlt={alt} badge={badge} />
        <CardBody>
          <CardTitle className="font-semibold">{cake.name}</CardTitle>
          <CardDescription>{firstSentence(cake.description ?? "")}</CardDescription>
        </CardBody>
      </Card>

      {open && (
        <DialogOverlay onClick={() => setOpen(false)} className="animate-dialog-overlay">
          <Dialog
            role="dialog"
            aria-modal="true"
            aria-label={cake.name}
            className="animate-dialog-panel relative max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close ✕ (top-right of the whole panel) */}
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
                  <h2 className="font-display-alt text-2xl font-bold leading-[1.1]">{cake.name}</h2>
                  {cake.description && (
                    <p className="text-large leading-[1.75] text-color-brown-900/75">{cake.description}</p>
                  )}
                </div>

                <hr className="border-line" />
                <p className="font-display-alt text-hero text-rust-500 font-bold">{price}</p>

                {cake.allergens && (
                  <>
                    <hr className="border-line" />
                    <div className="flex flex-col gap-1">
                      <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.1em] text-rust-500">
                        {allergensLabel ?? "Allergens"}
                      </span>
                      <span className="text-regular text-color-brown-900">{cake.allergens}</span>
                    </div>
                  </>
                )}

                {(orderHref || phone) && (
                  <div className="mt-2 flex gap-4">
                    {orderHref &&
                      (orderHref.startsWith("#") ? (
                        // Dialog order form: close this detail dialog and open the
                        // order form with THIS cake pre-selected.
                        <Button
                          variant={ButtonVariant.Primary}
                          onClick={() => {
                            setOpen(false);
                            openCakeOrder(cake.name);
                          }}
                          className="flex-1"
                        >
                          {orderLabel ?? "Order"}
                        </Button>
                      ) : (
                        <Button variant={ButtonVariant.Primary} href={orderHref} className="flex-1">
                          {orderLabel ?? "Order"}
                        </Button>
                      ))}
                    {phone && (
                      <Button variant={ButtonVariant.Secondary} href={`tel:${phone}`} className="flex-1">
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
