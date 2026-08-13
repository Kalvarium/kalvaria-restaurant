"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, ButtonVariant, Icon, Image, LanguagePill, LanguagePillTone } from "@/components/ui";
import { cn } from "@/lib/cn";
import { otherLocale } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";
import type { Link as NavLink } from "@/lib/strapi";

export interface HeaderProps {
  siteName: string;
  nav: NavLink[];
  cta: { label: string; href: string };
  /** True when the page opens with a dark Hero the navbar can overlay. Off → solid navbar from the top. */
  overHero?: boolean;
  /** Logo image URL from the Global single type; falls back to the bundled SVG. */
  logo?: string;
}

/**
 * Scroll-aware header: transparent over the hero (cream text with a shadow for
 * legibility), turning solid cream with dark text on scroll — the audit-verified
 * pattern. Mobile opens a green menu panel (cream links at 8.96:1).
 */
export function Header({ siteName, nav, cta, overHero = true, logo }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { locale, toggle: switchLocale } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid (cream) header when scrolled — or from the top on pages that don't open with a dark hero.
  const solid = !overHero || scrolled;
  const dark = solid && !open; // dark text only when solid header, not while menu open
  const next = otherLocale(locale);

  // The reservation link is already surfaced as the CTA button — drop it from the nav.
  const menu = nav.filter((n) => n.href !== cta.href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        solid ? "bg-cream/95 backdrop-blur border-b border-line" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-7 px-[clamp(20px,5vw,80px)]">
        <Link href="/" aria-label={siteName} className="flex flex-shrink-0 items-center">
          <Image
            src={logo ?? "/kalvarium_logo_text.svg"}
            alt={siteName}
            loading="eager"
            className={cn(
              "h-[54px] w-auto transition-[filter]",
              // dark wordmark: invert to light over the hero, keep dark on the cream header
              dark ? "" : "brightness-0 invert drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]",
            )}
          />
        </Link>

        {/* desktop nav — centered between logo and CTA */}
        <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex">
          {menu.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "relative font-ui text-[11px] font-bold uppercase tracking-[0.88px] transition-colors",
                // gold underline that wipes in from the left on hover
                "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100 motion-reduce:after:transition-none",
                dark
                  ? "text-brown-900 hover:text-rust-500"
                  : "text-ivory/90 hover:text-gold-500",
              )}
            >
              {n.label}
            </Link>
          ))}

          {/* language switch */}
          <LanguagePill
            tone={dark ? LanguagePillTone.Dark : LanguagePillTone.Light}
            showIcon={false}
            label={next}
            onClick={switchLocale}
            aria-label={`Prepnúť jazyk na ${next.toUpperCase()}`}
          />

        </nav>

        {/* CTA — separate item pinned to the right (desktop only) */}
        <div className="hidden flex-shrink-0 lg:block">
          <Button variant={dark ? ButtonVariant.Secondary : ButtonVariant.Light} href={cta.href}>
            {cta.label}
          </Button>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "ml-auto flex h-11 w-11 items-center justify-center rounded-sm lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500",
            dark ? "text-brown-900" : "text-cream",
          )}
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
      </div>

      {/* mobile menu panel */}
      {open && (
        <nav className="border-t border-line-dark bg-green-800 px-2 pb-4 lg:hidden">
          {menu.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center border-b border-cream/10 px-4 font-ui text-[14px] font-medium uppercase tracking-[0.08em] text-cream"
            >
              {n.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 px-2 pt-4">
            <LanguagePill
              tone={LanguagePillTone.Light}
              label={`${locale.toUpperCase()} / ${next.toUpperCase()}`}
              onClick={() => {
                switchLocale();
                setOpen(false);
              }}
            />
            <Button variant={ButtonVariant.Gold} href={cta.href} className="w-full" onClick={() => setOpen(false)}>
              {cta.label}
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
