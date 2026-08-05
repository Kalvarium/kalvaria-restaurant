import Link from "next/link";
import { Image } from "@/components/ui";
import type { Global, Link as NavLink, SocialLink } from "@/lib/strapi";

function Column({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h2 className="mb-4 font-ui text-[11px] font-semibold uppercase tracking-[1.65px] text-cream/40">
        {title}
      </h2>
      <ul>
        {links.map((l) => (
          <li key={l.href + l.label} className="border-b border-line-dark">
            <Link
              href={l.href}
              className="block py-3 font-ui text-medium font-medium text-cream/70 transition-[color,padding-left] duration-[250ms] ease-in-out hover:pl-1 hover:text-gold-500"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// The first N main-nav items fill the "Navigácia" column; the rest fall into
// "Podujatia", alongside any footer-only links (e.g. Reservation).
const NAV_SPLIT = 4;

export function Footer({ global, socialLinks = [] }: { global: Global; socialLinks?: SocialLink[] }) {
  const socials: NavLink[] = socialLinks.map((s) => ({
    label: capitalize(s.platform),
    href: s.url,
  }));

  const primaryNav = global.navigation.slice(0, NAV_SPLIT);
  const eventsNav = global.navigation.slice(NAV_SPLIT);

  return (
    <footer className="bg-brown-900">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Image
              src="/kalvarium_logo_text.svg"
              alt={global.siteName}
              className="mx-auto block h-10 w-auto brightness-0 invert"
            />
            {global.tagline && (
              <p className="mt-5 font-accent text-regular leading-relaxed text-cream/80">{global.tagline}</p>
            )}
          </div>

          {primaryNav.length > 0 && (
            <Column title={global.footerNavHeading ?? "Navigácia"} links={primaryNav} />
          )}
          {eventsNav.length > 0 && (
            <Column title={global.footerEventsHeading ?? "Podujatia"} links={eventsNav} />
          )}
          {socials.length > 0 && (
            <Column title={global.footerSocialHeading ?? "Sledujte nás"} links={socials} />
          )}
        </div>
      </div>

      {global.footerLegal && (
        <div className="border-t border-line-dark">
          <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8">
            <p className="font-accent text-xl text-cream/70">{global.footerLegal}</p>
          </div>
        </div>
      )}
    </footer>
  );
}
