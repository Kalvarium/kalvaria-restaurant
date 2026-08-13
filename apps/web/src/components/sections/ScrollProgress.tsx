"use client";

import { useEffect, useRef } from "react";

/**
 * A reading-progress indicator pinned just below the fixed 72px header: a thin
 * rust→gold line whose width tracks how far the page has been scrolled. Scroll
 * reads are coalesced into one `requestAnimationFrame` per frame (passive
 * listener) to avoid layout thrash. Mirrors the static site's `.scroll-progress`.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const apply = () => {
      const el = ref.current;
      if (el) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        el.style.width = `${progress}%`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-[72px] z-[60] h-[2px] w-0 bg-gradient-to-r from-rust-500 to-gold-500"
    />
  );
}
