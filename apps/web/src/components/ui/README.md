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
import { Button, Badge, Card, Field, Input, Textarea, Select,
         Checkbox, Alert, Eyebrow, LanguagePill, Icon } from "@/components/ui";
```

## Components

| Component | Notes |
| --- | --- |
| `Button` | `variant`: primary·secondary·ghost·light·gold; `size`: md·sm. Renders `<a>` (Next `Link`) when `href` is set, else `<button>`. 44px min target. |
| `Badge` | `variant`: rust·gold·soft·green. |
| `Eyebrow` | Uppercase Jost label above headings. |
| `Card` (+ `CardVariant`, `CardMedia`, `CardBody`, `CardHeader`, `CardEyebrow`, `CardTitle`, `CardDescription`, `CardFooter`) | Compound image-over-body card — compose the pieces you need. Body pieces self-space (`first:mt-0`). `variant` (`CardVariant.Bordered` default = white/hairline for cakes & feature cards; `CardVariant.Surface` = cream tile for the café menu) sets the surface + type scale across the pieces via context. `CardMedia` takes `aspect` (`4/3`/`16/9`), `zoom` (hover image zoom, needs `group` on the root), and `overlay` (title over a bottom gradient, for wide café tiles). |
| `List` + `ListItem` | The site's list — a rust marker per row with hairline dividers in the accent face; `text-current`/`border-current` so it adapts to the section background. `List` takes `ordered` (renders `<ol>`); `ListItem` takes `marker` (defaults to an em-dash; pass e.g. `"1."` for ordered rows). Use instead of raw `ul`/`li`. |
| `Field` + `Input`/`Textarea`/`Select` | `Field` wraps label + control + `hint`/`error`; controls take `error?` for the invalid state. Per-field errors. |
| `Checkbox` | Labelled checkbox, rust accent. |
| `Alert` | `variant`: success·error·warning, with a real SVG icon. |
| `LanguagePill` | 44px pill switch (client component). |
| `Icon` | Inline SVG set — real icons, never emoji. |

## Audit fixes baked in
Contrast-corrected tokens (footer text, gold-on-green), a stronger hero scrim
(`--hero-scrim`), and a 44px minimum tap target (`--control-min-target`). See
`docs/audits/2026-08-03-kalvarium-live-site-audit.md` and `design/tokens/tokens.json`.
