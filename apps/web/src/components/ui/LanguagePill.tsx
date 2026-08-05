"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export const LanguagePillTone = {
  Dark: "dark",
  Light: "light",
} as const;
export type LanguagePillTone = (typeof LanguagePillTone)[keyof typeof LanguagePillTone];

export interface LanguagePillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  /** "dark" for light backgrounds, "light" for dark backgrounds (e.g. over the hero). */
  tone?: LanguagePillTone;
  showIcon?: boolean;
}

const tones: Record<LanguagePillTone, string> = {
  // hover recolours text + border (no fill), matching the nav links
  dark: "border-brown-900 text-brown-900 hover:text-rust-500 hover:border-rust-500 focus-visible:outline-rust-500",
  light: "border-cream/70 text-cream/90 hover:text-gold-500 hover:border-gold-500 focus-visible:outline-cream",
};

/** Pill language switch. Meets the 44px minimum target (audit fix). */
export function LanguagePill({
  label = "SK / EN",
  tone = LanguagePillTone.Dark,
  showIcon = true,
  className,
  ...props
}: LanguagePillProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-[28.69px] px-3 rounded-pill",
        "border-[1.5px] font-ui font-semibold uppercase text-[11px] tracking-[0.88px] transition-colors cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        tones[tone],
        className,
      )}
      {...props}
    >
      {showIcon && <Icon name="globe" size={16} />}
      {label}
    </button>
  );
}
