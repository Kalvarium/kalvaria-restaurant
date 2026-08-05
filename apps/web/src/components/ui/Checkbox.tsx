import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("flex items-start gap-2.5 text-[14px] cursor-pointer", className)}>
      <input
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 accent-rust-500"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
