# Vivienda Paraguay

A calm, photo-led real-estate **listing portal** for Paraguay (working name;
production domain `vivienda.com.py`). Multi-agency, mobile-first, Spanish
(`es-PY`), with dual currency display (Guaraníes + US dollars) everywhere.

This repository is **Phase 1: a frontend MVP**. Its job is to nail the design,
browsing and per-property gallery experience using realistic seed data — before
any backend exists. There is **no database, no auth, no payments**. The only
contact channel is a WhatsApp deep link.

The single architectural rule that keeps Phase 2 from being a rewrite is the
**data-source seam** (below). Honor it.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict) + **Tailwind CSS**
- **Leaflet + OpenStreetMap** tiles for maps (no API key, free)
- **lucide-react** icons, **Fraunces** + **Inter** via Google Fonts
- **zod** for seed + API-input validation
- Hosting target: **Hostinger managed Node.js** (`next build` / `next start`).
  Never uses `output: 'export'`.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build (must pass clean)
npm start            # serve the production build
npm run lint
```

The site runs with **no `.env` file** — every variable degrades gracefully.
Copy `.env.example` to `.env.local` to override.

---

## The data-source seam (most important rule)

There are exactly **two** data modules with a strict division of labor:

| Module | Responsibility |
| --- | --- |
| **`lib/listings.ts`** | Pure, source-agnostic logic over already-loaded data: `formatDualPrice`, `slugify`, `filterListings`, `sortListings`, `isFeatured`, `getTopList`, `getLandingCombos`, … No I/O, never imports the seed. |
| **`lib/listings-repo.ts`** | **The only module that knows where listing data comes from.** Reads the seed array in Phase 1; in Phase 2 the same function bodies become Supabase queries with identical signatures. |

**`lib/listings-repo.ts` is the single file Phase 2 swaps to move from seed data
to Supabase.** Its exported contract:

```ts
getAllListings(): Promise<Listing[]>
getListingBySlug(slug: string): Promise<Listing | null>
queryListings(params: ListingQuery): Promise<{ items: Listing[]; total: number }>
getStaticLandingParams(): Promise<{ operacion: string; tipo: string; lugar?: string }[]>
```

Rules enforced throughout the codebase:

- Every repo function is `async` — even though the Phase 1 read is synchronous —
  so the contract already matches an async database.
- Pages, API routes, the sitemap, and `generateStaticParams` import data
  **only** from `lib/listings-repo.ts` (they may use `lib/listings.ts` for
  formatting/derivation). **Nothing else imports `content/listings.ts`.**

---

## How listings work

All listings live as one typed, zod-validated array in **`content/listings.ts`**.
That file is the entire "database" in Phase 1. The repo validates it against
`lib/listings-schema.ts` on first read, so a malformed entry fails loudly
instead of silently rendering broken cards.

### The image-filename contract

Each listing's `imagenes` array holds **bare filenames** (e.g. `prop1-1.jpg`)
that resolve to **`public/images/<filename>`**. Images are **committed to git**
because Hostinger's app filesystem is ephemeral — that's why Phase 1 has no
uploads, and why Phase 2 user uploads go to object storage (R2), not host disk.

Every image renders through `components/ImageWithFallback.tsx`: when a file is
missing it shows a tasteful gray placeholder with a house icon. **A fresh clone
with zero photos still looks polished and builds perfectly.** See
[`IMAGES.md`](./IMAGES.md) for the full manifest of the 48 gallery images.

### Adding / replacing photos

1. Generate images to the exact names in `IMAGES.md` (4:3, web-optimized JPEG).
2. Drop them into `public/images/`.
3. Commit. They auto-attach by filename — a typo is the only way it "fails".

### Adding a new listing

Append an object to the `seed` array in `content/listings.ts`. `precioGs` is
derived automatically from `precioUSD`, so you only set `precioUSD`. Fields:

| Field | Notes |
| --- | --- |
| `id` | Unique short string. |
| `slug` | SEO URL, e.g. `casa-en-venta-villa-morra-asuncion-a1b2`. Unique. |
| `operacion` | `"venta"` \| `"alquiler"`. |
| `tipo` | `casa` \| `departamento` \| `duplex` \| `terreno` \| `oficina` \| `local`. |
| `titulo`, `descripcion` | Spanish; description 2–4 sentences. |
| `precioUSD` | Number in US$. `precioGs` is computed at the fixed FX rate. |
| `barrio`, `ciudad`, `departamento` | Real Paraguayan locations. |
| `dormitorios`, `banos`, `cocheras` | Integers (0 for terreno beds/baths). |
| `superficieConstruida`, `superficieTerreno` | m² (construida = 0 for terreno). |
| `caracteristicas` | String tags, e.g. `["Piscina","Quincho"]`. |
| `coordenadas` | `{ lat, lng }` — roughly correct for the city. |
| `imagenes` | Filenames in `public/images` (see contract above). |
| `destacada` | `true` to feature on the home page (operator curation). |
| `destacadaHasta` | ISO date or `null`. **Featured-slot expiry rail** — a listing is featured if `destacada === true` **or** `destacadaHasta` is in the future. Phase 2 paid plans drive this; in Phase 1 set `null` or a future date. |
| `fechaPublicacion` | ISO date — powers "Más recientes" sorting. |
| `inmobiliaria` | `{ nombre, telefono }`. `telefono` in `595…` format for `wa.me`. |

> **Honest note:** editing the seed file is perfectly fine for **curated,
> low-volume** listings. The trigger to start Phase 2 is **regular daily edits**
> or **onboarding the first realtor** for self-serve posting.

---

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home: hero search, featured listings, top-lists, zona band. |
| `/comprar`, `/alquilar` | Results (all types), filterable, list + map toggle. |
| `/comprar/[tipo]`, `/comprar/[tipo]/[lugar]` | Same Results component + SEO furniture (unique H1, intro, meta, JSON-LD). |
| `/alquilar/[tipo]`, `/alquilar/[tipo]/[lugar]` | Idem, operación preset. |
| `/propiedad/[slug]` | Listing detail + full-screen gallery lightbox. |
| `/guardados` | Saved listings (reads `localStorage`). |
| `/api/v1/listings`, `/api/v1/listings/[slug]` | Read-only JSON API (below). |
| `/sitemap.xml`, `/robots.txt` | Generated from the data. |

Results and SEO landing pages are **one** component. Path segments preset
`operacion` / `tipo` / `lugar`; everything else (price, rooms, características,
sort) is query params, so URLs stay shareable. `generateStaticParams` emits only
`[tipo]` and `[tipo]/[lugar]` combos that have **≥1 listing**; empty combos are
not generated and are omitted from the sitemap (noindex by omission).

## API contract

`GET /api/v1/listings` accepts the same filter/sort query params the results
page uses (`operacion`, `tipo`, `ubicacion`, `precioMin`/`precioMax`,
`dormitorios`, `banos`, `supMin`/`supMax`, `caracteristicas`, `sort`, `page`,
`pageSize`), validates them with zod, and reads through `lib/listings-repo.ts`.
`GET /api/v1/listings/[slug]` returns one listing or 404. **This is the surface
the Phase 2 admin/app will extend** — Phase 1 keeps it read-only.

> Lead capture + GoHighLevel/Sheets fan-out arrives in Phase 2. Phase 1 captures
> no leads server-side; WhatsApp is the only channel.

## Configuration / env vars

Everything works with these unset (`.env.example`):

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # production: https://vivienda.com.py
NEXT_PUBLIC_SITE_NAME=Vivienda Paraguay
NEXT_PUBLIC_WHATSAPP_NUMBER=595000000000     # fallback contact if a listing has none
NEXT_PUBLIC_FX_PYG_USD=7300                  # display conversion rate (1 USD ≈ Gs)
```

---

## Deploy (Hostinger managed Node.js)

Standard scripts: `dev`, `build` (`next build`), `start` (`next start`). A simple
CI step (`npm ci && npm run build`) is enough.

In **hPanel**:

1. **Websites → Add Website → Node.js Apps → Import Git Repository**
2. Branch: **`main`**
3. Next.js preset is auto-detected · Root: **`./`**
4. **Node version: 22.x** (current LTS)
5. Add the env vars from `.env.example`
6. **Deploy** → attach the domain.

Every merge to `main` auto-redeploys. Hostinger's app filesystem is **ephemeral**,
so seed images live in the repo (`public/images`, committed to git).

---

## Phase 2 roadmap (listing platform, full)

- **Supabase** (Postgres + Auth) behind the existing `lib/listings-repo.ts`
  contract.
- **Agency accounts + self-serve posting** with a
  `draft → pending_review → published → paused → expired` status machine (new
  posters moderated via the Supabase table editor — no custom admin panel at
  launch).
- **Featured slots + poster plans** monetization (the `destacadaHasta` rail goes
  live).
- **Lead capture orchestrator** with GoHighLevel + Google Sheets fan-out
  (`Promise.allSettled`, retries, never blocks the user).
- **Cloudflare R2** presigned image uploads (never-block).
- **Expanded programmatic SEO** from live data.

Seekers still browse and contact **without accounts**, now and later.
