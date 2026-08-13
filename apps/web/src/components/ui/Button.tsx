import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const ButtonVariant = {
  Primary: "primary",
  Secondary: "secondary",
  Ghost: "ghost",
  Light: "light",
  Gold: "gold",
  White: "white",
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ButtonSize = {
  Md: "md",
  Sm: "sm",
} as const;
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

const base =
  "inline-flex items-center justify-center gap-2 font-ui font-semibold uppercase rounded-sm " +
  "border-2 transition-colors cursor-pointer select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:opacity-45 disabled:pointer-events-none aria-disabled:opacity-45 aria-disabled:pointer-events-none";

const sizes: Record<ButtonSize, string> = {
  md: "min-h-[var(--control-min-target)] text-[13px] tracking-[1.3px]",
  sm: "min-h-10 text-[12px] tracking-[0.88px]",
};

const variants: Record<ButtonVariant, string> = {
  // primary action — rust with white text (white on rust = 5.03:1)
  primary: "bg-rust-500 text-white border-rust-500 hover:bg-rust-600 hover:border-rust-600 focus-visible:outline-rust-500",
  // outline on light
  secondary: "text-brown-900 border-brown-900 hover:bg-brown-900 hover:text-cream focus-visible:outline-rust-500",
  // inline / low-emphasis
  ghost: "border-transparent text-rust-500 hover:underline underline-offset-4 focus-visible:outline-rust-500",
  // on dark / over hero — subtle translucent fill on hover (matches the live outline button)
  light: "text-cream border-cream/70 hover:bg-cream/15 focus-visible:outline-cream",
  // decorative accent on dark — uses the legible gold
  gold: "text-gold-400 border-gold-400 hover:bg-gold-400 hover:text-brown-900 focus-visible:outline-cream",
  // white fill, dark outline + text — inverts to dark on hover
  white: "bg-white text-brown-900 border-brown-900 hover:bg-brown-900 hover:text-cream focus-visible:outline-rust-500",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };
export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = ButtonVariant.Primary,
  size = ButtonSize.Md,
  className,
  children,
  ...props
}: ButtonProps) {
  const pad = variant === ButtonVariant.Ghost ? "px-2" : size === ButtonSize.Sm ? "px-5" : "px-8";
  const classes = cn(base, sizes[size], variants[variant], pad, className);

  // A null/empty href (e.g. an unset CMS link) is not a link — render a <button>.
  if ("href" in props && props.href != null && props.href !== "") {
    const linkProps = props as ButtonAsLink;
    // An href of "#some-id" is an on-page trigger, not a link: render a plain
    // <button id="some-id"> (no href → no URL change). A client component (e.g. the
    // Form dialog) finds it by id and wires the click. No handler here keeps it
    // usable inside server components.
    if (linkProps.href.startsWith("#")) {
      return (
        <button type="button" id={linkProps.href.slice(1)} className={classes}>
          {children}
        </button>
      );
    }
    return (
      <Link className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
