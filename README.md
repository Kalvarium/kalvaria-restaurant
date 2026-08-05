# Kalvaria Restaurant

A TypeScript monorepo for the Kalvaria restaurant project, orchestrated with
[Turborepo](https://turborepo.com/) over npm workspaces.

## What's inside

| Path             | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `apps/web`       | Next.js (App Router) frontend, styled with Tailwind CSS v4 |
| `apps/cms`       | Strapi v5 headless CMS (SQLite in development)           |
| `packages/config`| Shared TypeScript + ESLint configuration                |
| `packages/ui`    | Shared React + Tailwind component library (`@kalvaria/ui`) |
| `packages/types` | Shared TypeScript types (`@kalvaria/types`)             |

## Requirements

- Node.js `>=20 <=24` (see `.nvmrc` — run `nvm use`)
- npm `>=10`

## Getting started

```bash
# Install all workspace dependencies from the repo root
npm install

# Set up the CMS environment
cp apps/cms/.env.example apps/cms/.env
# then fill in real secrets (APP_KEYS, *_SALT, *_SECRET, ENCRYPTION_KEY)
```

## Development

```bash
npm run dev        # run web + cms together (Turborepo)
npm run dev:web    # Next.js only        → http://localhost:3000
npm run dev:cms    # Strapi only         → http://localhost:1337/admin
```

## Other tasks

```bash
npm run build       # build all apps
npm run lint        # lint all workspaces
npm run type-check  # type-check all workspaces
```

## Database

The CMS uses SQLite in development with no extra setup. To use PostgreSQL in
production, set `DATABASE_CLIENT=postgres` and the related `DATABASE_*` variables
in `apps/cms/.env` — see `apps/cms/config/database.ts`.
