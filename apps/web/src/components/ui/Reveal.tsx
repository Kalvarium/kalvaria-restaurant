"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const RevealVariant = {
  Up: "up",
  Left: "left",
  Right: "right",
  Stagger: "stagger",
} as const;
export type RevealVariant = (typeof RevealVariant)[keyof typeof RevealVariant];

const variantClass: Record<RevealVariant, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
  stagger: "reveal-stagger",
};

export interface RevealProps {
  variant?: RevealVariant;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Adds a `.visible` class the first time the element scrolls into view. */
export function Reveal({ variant = RevealVariant.Up, className, style, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn(variantClass[variant], visible && "visible", className)} style={style}>
      {children}
    </div>
  );
}
