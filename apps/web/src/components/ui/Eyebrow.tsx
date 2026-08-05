import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type EyebrowProps = HTMLAttributes<HTMLSpanElement>;

/** Small uppercase label above a heading. Jost 600, wide tracking, rust. */
export function Eyebrow({ className, children, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        "font-ui font-semibold uppercase text-[12px] tracking-[1.65px] text-rust-500",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
