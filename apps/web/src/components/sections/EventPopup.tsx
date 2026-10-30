"use client";

import { useEffect, useRef, useState } from "react";
import { DialogOverlay, Icon, Image } from "@/components/ui";
import { useLocale } from "@/lib/locale-context";
import { media, type Event } from "@/lib/strapi";

/** Delay before the popup appears, so the page renders first. */
const OPEN_DELAY_MS = 800;

/**
 * Set once the popup has opened. Module state survives client-side navigation
 * (Next <Link>) but resets on a full page load, so the popup shows once per load:
 * on the page you land on or reload, not again on the pages you navigate to.
 */
let shownThisLoad = false;

/** Time each slide stays up when several events are active. */
const SLIDE_MS = 5000;
/** Horizontal drag (px) that counts as a swipe. */
const SWIPE_PX = 50;

const LABELS = {
  sk: { dialog: "Akcia", close: "Zavrieť", prev: "Predchádzajúca", next: "Ďalšia", slide: "Snímka" },
  en: { dialog: "Special offer", close: "Close", prev: "Previous", next: "Next", slide: "Slide" },
} as const;

const controlClass =
  "flex h-11 w-11 items-center justify-center rounded-full bg-surface/90 text-brown-900 shadow-card backdrop-blur-sm transition duration-300 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface/90";

/**
 * Promotional popup for the active CMS Events, shown once per full page load
 * (landing or reload) — not again when navigating to other pages in the site.
 * The panel is ~82% of the viewport's width and height (≈ 2/3 of the screen
 * area); each poster is shown whole (`object-contain`) with no background or
 * frame around it, so only the image itself is visible. Several events slide through
 * automatically (paused on hover/focus, stopping on the last one) with arrows, dots,
 * ←/→ keys and swipe. No wrap-around: the arrow at either end is disabled; with a
 * single event there are no arrows or dots.
 * Closes via the ✕, Esc or a click on the backdrop.
 */
export function EventPopup({ events }: { events: Event[] }) {
  const { locale } = useLocale();
  const t = LABELS[locale];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  // Paused while hovered, or while a slider control has keyboard focus (not the ✕, which is focused on open).
  const [hovered, setHovered] = useState(false);
  const [controlFocused, setControlFocused] = useState(false);
  const paused = hovered || controlFocused;
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const count = events.length;

  const go = (step: number) => setIndex((i) => Math.min(Math.max(i + step, 0), count - 1));

  useEffect(() => {
    if (shownThisLoad) return;
    const timer = window.setTimeout(() => {
      shownThisLoad = true;
      setOpen(true);
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
      else if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, count - 1));
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      previousFocus?.focus();
    };
  }, [open, count]);

  // Autoplay: restarts after every slide change (so manual navigation gets a full
  // interval) and stops on the last slide.
  useEffect(() => {
    if (!open || paused || index >= count - 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setIndex((i) => Math.min(i + 1, count - 1)), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [open, paused, index, count]);

  if (!open) return null;

  return (
    <DialogOverlay onClick={() => setOpen(false)} className="animate-dialog-overlay">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.dialog}
        aria-roledescription={count > 1 ? "carousel" : undefined}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={(e) => setControlFocused(e.target.matches("[data-slider-control]:focus-visible"))}
        onBlur={() => setControlFocused(false)}
        className="animate-dialog-panel relative h-[82dvh] w-[82vw] overflow-hidden"
      >
        <div
          className="flex h-full touch-pan-y transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
          onPointerDown={(e) => (swipeStart.current = e.clientX)}
          onPointerUp={(e) => {
            if (swipeStart.current === null || count < 2) return;
            const dx = e.clientX - swipeStart.current;
            swipeStart.current = null;
            if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
          }}
        >
          {events.map((event, i) => {
            const src = media(event.image?.url);
            return (
              <div
                key={event.documentId}
                role={count > 1 ? "group" : undefined}
                aria-roledescription={count > 1 ? "slide" : undefined}
                aria-label={count > 1 ? `${t.slide} ${i + 1} / ${count}` : undefined}
                aria-hidden={i !== index}
                className="relative h-full w-full shrink-0 overflow-hidden"
              >
                {src && (
                  <Image
                    src={src}
                    alt={event.image?.alternativeText || t.dialog}
                    loading="eager"
                    draggable={false}
                    className="h-full w-full select-none object-contain"
                  />
                )}
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label={t.prev}
              data-slider-control
              className={`${controlClass} absolute left-3 top-1/2 z-10 -translate-y-1/2 sm:left-4`}
            >
              <Icon name="arrow" size={20} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === count - 1}
              aria-label={t.next}
              data-slider-control
              className={`${controlClass} absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-4`}
            >
              <Icon name="arrow" size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-brown-900/40 px-2 py-1 backdrop-blur-sm">
              {events.map((event, i) => (
                <button
                  key={event.documentId}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${t.slide} ${i + 1} / ${count}`}
                  aria-current={i === index}
                  data-slider-control
                  className="flex h-6 items-center justify-center px-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-surface"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-surface" : "w-2 bg-surface/50"}`}
                  />
                </button>
              ))}
            </div>
          </>
        )}

        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t.close}
          className={`${controlClass} absolute right-3 top-3 z-10 hover:rotate-90 sm:right-4 sm:top-4`}
        >
          <Icon name="close" size={22} />
        </button>
      </div>
    </DialogOverlay>
  );
}
