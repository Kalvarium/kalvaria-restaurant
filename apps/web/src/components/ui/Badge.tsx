import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const BadgeVariant = {
  Rust: "rust",
  Gold: "gold",
  Soft: "soft",
  Green: "green",
} as const;
export type BadgeVariant = (typeof BadgeVariant)[keyof typeof BadgeVariant];

const variants: Record<BadgeVariant, string> = {
  rust: "bg-rust-500 text-white",
  gold: "bg-gold-400 text-brown-900",
  soft: "bg-rust-500/10 text-rust-500 border border-rust-500/30",
  green: "bg-green-800 text-cream",
};

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

export function Badge({ variant = BadgeVariant.Rust, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-ui font-semibold uppercase text-[11px] tracking-[0.09em] px-[11px] py-[5px] rounded-pill",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
