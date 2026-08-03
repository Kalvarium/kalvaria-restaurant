# Kalvaria Restaurant Monorepo — Design

**Date:** 2026-08-03
**Status:** Approved

## Goal

Scaffold a TypeScript monorepo for the Kalvaria restaurant project containing a
Next.js (App Router) frontend styled with Tailwind CSS v4 and a Strapi v5
headless CMS, plus shared packages for configuration, UI, and types.

## Decisions

| Area | Choice |
| --- | --- |
| Layout | `apps/web` + `apps/cms` + `packages/*` |
| Tooling | Turborepo |
| Package manager | npm workspaces |
| Frontend | Next.js latest, App Router, `src/` dir, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first, no `tailwind.config.js`) |
| CMS | Strapi v5, TypeScript |
| CMS dev database | SQLite (`better-sqlite3`), env-driven so prod can use Postgres |
| Shared packages | `config`, `ui`, `types` |

## Architecture

```
kalvaria-restaurant/
├── apps/
│   ├── web/          # Next.js (App Router) + Tailwind v4 — public site
│   └── cms/          # Strapi v5 — headless CMS (SQLite in dev)
├── packages/
│   ├── config/       # shared tsconfig + ESLint config
│   ├── ui/           # shared React components (Tailwind-styled)
│   └── types/        # shared TS types (incl. Strapi content shapes)
├── package.json      # workspaces + root scripts
├── turbo.json        # task pipeline (dev, build, lint, type-check)
├── .gitignore
├── .nvmrc
└── README.md
```

### Data flow

Strapi (`apps/cms`) exposes content via REST/GraphQL. The Next.js app
(`apps/web`) fetches it server-side in App Router Server Components. Shared
content-type types live in `packages/types` so the web app is typed against
Strapi's content shapes.

## Components

### apps/web
- Next.js latest, App Router, `src/` directory, TypeScript.
- Tailwind v4 via `@tailwindcss/postcss`; `globals.css` uses
  `@import "tailwindcss"` (CSS-first config, no `tailwind.config.js`).
- Consumes `@kalvaria/ui` and `@kalvaria/types`; extends `@kalvaria/config`.
- `transpilePackages` set for the internal source-only packages.

### apps/cms
- Strapi v5 scaffolded with TypeScript.
- SQLite dev database via `better-sqlite3`.
- Database connection driven by environment variables so production can switch
  to PostgreSQL without code changes.
- Its own `.env` (git-ignored) with an `.env.example` committed.

### packages/config
- `base.tsconfig.json` extended by apps and packages.
- Shared ESLint flat config.

### packages/ui
- React + Tailwind component library.
- Exposed via `package.json` `exports`; consumed as source (no build step)
  through `transpilePackages` in Next.js.

### packages/types
- Plain TypeScript types shared across apps, including Strapi content shapes.

## Tooling & scripts

- **Turborepo** `turbo.json` pipeline: `dev` (persistent, both apps), `build`,
  `lint`, `type-check`, with appropriate `dependsOn` and caching.
- Root scripts: `npm run dev` (all workspaces), plus filtered `dev:web` and
  `dev:cms`.
- Node version pinned via `.nvmrc`.
- npm workspaces glob `apps/*` and `packages/*`.

## Out of scope (YAGNI)

- Docker / containerization
- CI pipeline
- PostgreSQL provisioning (only env plumbing is included)
- Authentication
- Testing framework
- Modeled content types
- Deployment configuration

Each of these can be added later as its own increment.
