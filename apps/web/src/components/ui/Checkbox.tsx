import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 cursor-pointer font-accent text-regular leading-[1.5] text-color-brown-900/75",
        className,
      )}
    >
      <input
        type="checkbox"
        className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-rust-500"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
