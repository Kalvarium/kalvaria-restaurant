"use client";

import { createContext, useContext, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Image } from "./Image";
import { Badge, BadgeVariant } from "./Badge";

/**
 * The site's card, as a compound component. Compose the pieces you need:
 *
 *   <Card variant={CardVariant.Surface}>
 *     <CardMedia image={url} imageAlt="…" badge={…} />
 *     <CardBody>
 *       <CardHeader>
 *         <CardEyebrow>…</CardEyebrow>
 *         <CardTitle>…</CardTitle>
 *       </CardHeader>
 *       <CardDescription>…</CardDescription>
 *       <CardFooter>…</CardFooter>
 *     </CardBody>
 *   </Card>
 *
 * Variants change the surface + type scale for the whole card (root, body,
 * title, description) via context, so the same pieces serve cakes (Bordered)
 * and the café menu (Surface). Vertical rhythm is automatic: each body piece
 * adds its own top margin but drops it (`first:mt-0`) when it's the first child.
 *
 * Layout only — no motion, hover, or interaction. Add effects (hover lift, image
 * zoom, reveal) at the call site via `className`, so each page owns its behaviour.
 */

/** Surface + type treatment applied across a card's pieces. */
export const CardVariant = {
  /** White panel with a hairline border — cakes, feature cards. */
  Bordered: "bordered",
  /** Cream, borderless menu tile — the café menu. */
  Surface: "surface",
} as const;
export type CardVariant = (typeof CardVariant)[keyof typeof CardVariant];

const CardVariantContext = createContext<CardVariant>(CardVariant.Bordered);

const rootVariant: Record<CardVariant, string> = {
  [CardVariant.Bordered]: "border border-black/[0.08] bg-white",
  [CardVariant.Surface]: "bg-cream",
};
const bodyVariant: Record<CardVariant, string> = {
  [CardVariant.Bordered]: "px-7 pt-7 pb-8",
  [CardVariant.Surface]: "px-5 pt-5 pb-6",
};
const titleVariant: Record<CardVariant, string> = {
  [CardVariant.Bordered]: "mt-3 font-display-alt text-subtitle first:mt-0",
  [CardVariant.Surface]: "font-display-alt text-xl font-normal first:mt-0",
};
const descriptionVariant: Record<CardVariant, string> = {
  [CardVariant.Bordered]: "mt-3 mb-10 text-large leading-[1.75] text-color-brown-900 first:mt-0",
  [CardVariant.Surface]: "mt-1.5 font-accent text-regular leading-[1.6] text-color-brown-900/70 first:mt-0",
};

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
}

/** Card root — an image-over-body panel. */
export function Card({ variant = CardVariant.Bordered, className, children, ...props }: CardProps) {
  return (
    <CardVariantContext.Provider value={variant}>
      <article className={cn("flex flex-col overflow-hidden", rootVariant[variant], className)} {...props}>
        {children}
      </article>
    </CardVariantContext.Provider>
  );
}

export interface CardMediaProps {
  image: string;
  imageAlt?: string;
  /** Corner badge over the image. */
  badge?: { label: string; variant?: BadgeVariant };
  /** Caption shown under the image. */
  caption?: string;
  /** Image region aspect ratio (default 4:3; use 16:9 for wide tiles). */
  aspect?: "4/3" | "16/9";
  /** Zoom the image slightly on hover — requires `group` on the Card root. */
  zoom?: boolean;
  /** Content laid over the bottom of the image in a dark gradient (e.g. a title). */
  overlay?: ReactNode;
  className?: string;
}

/** Image region with an optional badge, caption, hover-zoom, and bottom overlay. */
export function CardMedia({
  image,
  imageAlt,
  badge,
  caption,
  aspect = "4/3",
  zoom = false,
  overlay,
  className,
}: CardMediaProps) {
  return (
    <figure className={className}>
      <div className={cn("relative overflow-hidden", aspect === "16/9" ? "aspect-[16/9]" : "aspect-[4/3]")}>
        <Image
          src={image}
          alt={imageAlt ?? ""}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            zoom && "transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105",
          )}
        />
        {badge && (
          <Badge variant={badge.variant} className="absolute left-4 top-4 z-[2]">
            {badge.label}
          </Badge>
        )}
        {overlay && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-7 pb-8 pt-16">
            {overlay}
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="px-7 pt-3 font-ui text-small text-color-brown-900/55">{caption}</figcaption>
      )}
    </figure>
  );
}

/** Padded body that holds the card's text + footer. */
export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const variant = useContext(CardVariantContext);
  return (
    <div className={cn(bodyVariant[variant], className)} {...props}>
      {children}
    </div>
  );
}

/** Optional grouping for the eyebrow + title at the top of the body. */
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("first:mt-0", className)} {...props}>
      {children}
    </div>
  );
}

/** Uppercase label above the title. */
export function CardEyebrow({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-ui text-[12px] font-semibold uppercase tracking-[1.65px] text-rust-500 first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const variant = useContext(CardVariantContext);
  return (
    <h3 className={cn(titleVariant[variant], className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const variant = useContext(CardVariantContext);
  return (
    <p className={cn(descriptionVariant[variant], className)} {...props}>
      {children}
    </p>
  );
}

/** Footer row (links, buttons) under the body content. */
export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-5 first:mt-0", className)} {...props}>
      {children}
    </div>
  );
}
