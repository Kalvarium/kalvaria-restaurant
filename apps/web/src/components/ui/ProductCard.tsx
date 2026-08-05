import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge, type BadgeVariant } from "./Badge";

export interface ProductCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  price: string;
  badge?: { label: string; variant?: BadgeVariant };
  action?: ReactNode;
  className?: string;
}

/**
 * Product / feature card — image over body. Uses the café's own photography
 * (pica: client's own assets, never stock or emoji).
 */
export function ProductCard({
  image,
  imageAlt,
  title,
  description,
  price,
  badge,
  action,
  className,
}: ProductCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden bg-surface border border-line rounded-sm shadow-card",
        className,
      )}
    >
      <div
        role="img"
        aria-label={imageAlt}
        className="relative aspect-[4/3] bg-cover bg-center"
        style={{ backgroundImage: `url("${image}")` }}
      >
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-[18px]">
        <h3 className="font-display-alt font-semibold text-[20px]">{title}</h3>
        <p className="flex-1 text-[14px] text-brown-900/70">{description}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-display-alt font-semibold text-[20px]">{price}</span>
          {action}
        </div>
      </div>
    </article>
  );
}
