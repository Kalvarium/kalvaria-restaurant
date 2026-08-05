import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

/** Raised surface panel on the cream ground. */
export function Card({ padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-line rounded-sm shadow-card",
        padded && "p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
