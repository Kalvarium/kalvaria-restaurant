import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";
import { Checkbox } from "./Checkbox";
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
      className={cn(controlBase, "min-h-24 resize-none", error ? errorBorder : okBorder, className)}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

/**
 * A labelled form control driven by config (one CMS `form-field` entry). Editorial
 * underline style: a small caps label (with `*` when required) over a serif input
 * with only a bottom rule. Renders a `<textarea>` for `type: "textarea"`.
 */
export type TextFieldType =
  | "text"
  | "tel"
  | "email"
  | "date"
  | "time"
  | "number"
  | "textarea"
  | "checkbox"
  | "select";
export interface TextFieldProps {
  name: string;
  label?: string;
  type?: TextFieldType;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  /** Choices for `type: "select"`. */
  options?: { label: string; value: string }[];
  /** Applied to the field wrapper — e.g. "sm:col-span-2" for full width. */
  className?: string;
}

const underlineControl =
  "w-full min-h-[var(--control-min-target)] border-0 border-b border-color-brown-900/25 bg-transparent px-0 py-2 " +
  "font-accent text-large text-color-brown-900 transition-colors outline-none " +
  "placeholder:text-color-brown-900/40 " +
  "focus:border-color-brown-900/70";

export function TextField({
  name,
  label,
  type = "text",
  placeholder,
  required,
  min,
  max,
  options,
  className,
}: TextFieldProps) {
  // A checkbox is its own control — the label is the text beside the box.
  if (type === "checkbox") {
    return <Checkbox name={name} value="yes" required={required} label={label} className={className} />;
  }

  const autoComplete =
    type === "email" ? "email" : type === "tel" ? "tel" : type === "text" && name === "name" ? "name" : undefined;
  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label
          htmlFor={name}
          className="mb-2 font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-color-brown-900/70"
        >
          {label}
          {required && <span className="text-rust-500"> *</span>}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          rows={3}
          className={cn(underlineControl, "min-h-24 resize-none")}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          required={required}
          defaultValue=""
          className={cn(underlineControl, "cursor-pointer")}
        >
          <option value="" disabled hidden>
            {placeholder ?? "—"}
          </option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          autoComplete={autoComplete}
          className={underlineControl}
        />
      )}
    </div>
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
