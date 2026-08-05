import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

const controlBase =
  "font-ui text-[16px] text-brown-900 bg-surface rounded-sm px-3.5 py-3 w-full border-[1.5px] " +
  "outline-none transition-shadow placeholder:text-brown-900/40 " +
  "disabled:bg-[#f1ece2] disabled:text-brown-900/60 disabled:cursor-not-allowed";

const okBorder = "border-line focus:border-rust-500 focus:shadow-[0_0_0_3px_rgba(168,90,50,0.22)]";
const errorBorder = "border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(178,59,46,0.20)]";

/** Field wrapper: label + control + hint/error. Errors are per-field (audit pattern). */
export interface FieldProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-[14px] font-semibold">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <span className="text-[12px] text-brown-900/60">{hint}</span>}
      {error && (
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-error">
          <Icon name="alert" size={14} />
          {error}
        </span>
      )}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(controlBase, "min-h-[var(--control-min-target)]", error ? errorBorder : okBorder, className)}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(controlBase, "min-h-24 resize-y", error ? errorBorder : okBorder, className)}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}
export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(controlBase, "min-h-[var(--control-min-target)]", error ? errorBorder : okBorder, className)}
      aria-invalid={error || undefined}
      {...props}
    >
      {children}
    </select>
  );
}
