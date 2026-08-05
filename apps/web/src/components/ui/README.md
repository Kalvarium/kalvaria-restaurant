# Kalvárium shared UI components

Brand components for the web app, built from the design system in
`design/design-system.html` and the tokens in `design/tokens/`. Styling uses
Tailwind v4 utilities backed by the token theme in `src/app/globals.css`
(colours like `rust-500`/`cream`/`green-800`, fonts `font-display`/`font-ui`,
`rounded-sm`, `shadow-card`). Fonts are loaded via `next/font` in
`src/app/layout.tsx` (Marcellus, Playfair Display, Jost, Cormorant Garamond).

Live gallery of every component + state: **`/kit`** (`src/app/kit/page.tsx`).

## Import

```tsx
import { Button, Badge, Card, ProductCard, Field, Input, Textarea, Select,
         Checkbox, Alert, Eyebrow, LanguagePill, Icon } from "@/components/ui";
```

## Components

| Component | Notes |
| --- | --- |
| `Button` | `variant`: primary·secondary·ghost·light·gold; `size`: md·sm. Renders `<a>` (Next `Link`) when `href` is set, else `<button>`. 44px min target. |
| `Badge` | `variant`: rust·gold·soft·green. |
| `Eyebrow` | Uppercase Jost label above headings. |
| `Card` | Raised surface panel (`padded` prop, default true). |
| `ProductCard` | `image`, `imageAlt`, `title`, `description`, `price`, `badge?`, `action?`. |
| `Field` + `Input`/`Textarea`/`Select` | `Field` wraps label + control + `hint`/`error`; controls take `error?` for the invalid state. Per-field errors. |
| `Checkbox` | Labelled checkbox, rust accent. |
| `Alert` | `variant`: success·error·warning, with a real SVG icon. |
| `LanguagePill` | 44px pill switch (client component). |
| `Icon` | Inline SVG set — real icons, never emoji. |

## Audit fixes baked in
Contrast-corrected tokens (footer text, gold-on-green), a stronger hero scrim
(`--hero-scrim`), and a 44px minimum tap target (`--control-min-target`). See
`docs/audits/2026-08-03-kalvarium-live-site-audit.md` and `design/tokens/tokens.json`.
