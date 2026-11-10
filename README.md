# saas-starter

Next.js 15 + Supabase Starter mit:

- GitHub OAuth
- Geschützte Routen (Middleware)
- Profile + Avatar Upload
- Projects CRUD
- Server Actions
- Sidebar + Topbar Layout

## Setup

1. `pnpm install`
2. `.env.local` mit Supabase-Keys anlegen (siehe `.env.example`)
3. `supabase-schema.sql` im Supabase SQL-Editor ausführen
4. GitHub Provider in Supabase Auth aktivieren
5. Redirect URL: `http://localhost:3000/auth/callback`
6. `pnpm dev`

## Struktur

- `app/(app)/` – geschützte Seiten mit Layout
- `app/actions/` – Server Actions
- `components/` – UI-Komponenten
- `lib/supabase/` – Client + Server
