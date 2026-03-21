# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint (next lint)
npm test             # Jest tests
npm run test:watch   # Jest watch mode
npx jest path/to/test.test.tsx  # Run a single test
npx prisma generate  # Regenerate Prisma client (also runs on postinstall)
npx prisma db push   # Push schema changes to MongoDB
```

## Architecture

**Next.js 16 App Router** single-page dashboard with MongoDB (Prisma), Auth.js (NextAuth v5), and Cloudinary.

### Routing & Page Structure

Single route (`/`) — `app/page.tsx` is a Server Component that fetches user categories from the database via server action, falling back to `DROPDOWN_CONTENT` constants for unauthenticated users.

**API routes** in `app/api/`:
- `auth/[...nextauth]` — Auth.js handlers
- `weather/` — Proxies OpenWeather + AQI APIs
- `wallpapers/` — CRUD + upload to Cloudinary

### Provider Hierarchy (app/layout.tsx)

`CheckboxProvider` → `SessionProvider` → `AuthModalProvider` → `Toaster` → page content

### Data Flow

- **Server Components** fetch data directly via Prisma
- **Server Actions** (`lib/actions/`) handle all mutations (auth, dropdown CRUD, user ops) with `revalidatePath('/')` to refresh
- **Client-side fetching** for dynamic widgets (weather, exchange rates)

### Component Organization

Feature-based directories under `components/`, each with a `.tsx` file and `.module.css`:
- `background-image/`, `clock-widget/`, `dropdown-menus/`, `exchange-widget/`, `footer/`, `header/`, `search/`, `weather-widget/`

### Database

MongoDB via Prisma. Schema in `prisma/schema.prisma`, client output to `generated/prisma/`.

Key models: `User` → `Category` (ordered) → `Link` (ordered), `User` → `Wallpaper` (max 5 per user).

### Authentication

Auth.js v5 with JWT strategy. Providers: Google OAuth + Credentials (bcryptjs). Default categories auto-created on first login in the `jwt` callback (`auth.ts`).

### Styling

Tailwind CSS + CSS Modules hybrid. Global styles in `app/globals.css`. Fonts: Geist Sans/Mono.

### Key Libraries

- `@dnd-kit` — drag-and-drop reordering for categories/links
- `zod` — schema validation (`lib/zodSchemas.ts`, `lib/validators.ts`)
- `react-hot-toast` — notifications
- `next-cloudinary` — image uploads

### Type Definitions

- `types.d.ts` — global types
- `next-auth-d.ts` — NextAuth session type extensions
- `generated/prisma/` — Prisma-generated types

### Path Alias

`@/*` maps to project root (tsconfig.json).

## Environment Variables

Required (see README.md for full list): `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `WEATHER_API_KEY`, `AQI_API_KEY`, `NEXT_PUBLIC_EXCHANGE_API_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_DEFAULT_LATITUDE`, `NEXT_PUBLIC_DEFAULT_LONGITUDE`, `NEXT_PUBLIC_DEFAULT_LANGUAGE`, `NEXT_PUBLIC_USER`.

## CI/CD

GitHub Actions (`.github/workflows/pipeline.yml`): lint → build → test → Vercel deployment check → auto-PR/merge. Runs on non-main branch pushes.

## Build Notes

- `next.config.ts` intentionally ignores TypeScript and ESLint errors during builds
- Tests use jsdom environment with `identity-obj-proxy` for CSS module mocking
