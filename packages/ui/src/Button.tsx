import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-amber-600 text-white hover:bg-amber-700",
  secondary: "bg-transparent text-amber-700 border border-amber-600 hover:bg-amber-50",
};

/**
 * Shared button used across Kalvaria apps. Styled with Tailwind utilities that
 * are picked up by the consuming app's Tailwind build (see `@source` in the
 * web app's globals.css).
 */
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
