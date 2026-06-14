# Vivienda Paraguay

A calm, photo-led **real-estate listing portal** for Paraguay (working name;
production domain `vivienda.com.py`). Multi-agency portal in the spirit of
Hemnet: fast, beautiful, mobile-first, with a great per-property photo gallery.

This repository is **Phase 1 — a frontend MVP**. Its job is to nail the design,
browsing and gallery experience with realistic seed data, **before any backend
exists**. There is deliberately no database, no auth, no payments. The only
contact mechanism is a WhatsApp deep link.

- **Stack:** Next.js (App Router) · TypeScript (strict) · Tailwind CSS ·
  Leaflet + OpenStreetMap · lucide-react · Google Fonts (Fraunces + Inter)
- **Locale:** Spanish (Paraguay) — `es-PY`
- **Currency:** dual display everywhere — Guaraníes (`Gs.`) and US dollars
  (`US$`) at a fixed `1 USD ≈ 7.300 Gs` (one config constant).

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build (must pass clean)
npm run start    # serve the production build
```

The site builds and runs with **every env var unset** and **zero image files
present** — it degrades gracefully (fallback contact number, placeholder
images).

---

## The data-source seam (the most important architectural rule)

All listing data flows through **exactly two modules** with a strict division of
labor. Honoring this seam is what keeps Phase 2 from being a rewrite.

| Module | Responsibility |
| --- | --- |
| **`lib/listings.ts`** | Pure, **source-agnostic** logic over already-loaded data: `formatDualPrice`, `slugify`, `filterListings`, `sortListings`, `isFeatured`, `getTopList`, `getLandingCombos`, similar-listings, WhatsApp links. **No I/O, never imports the seed.** |
| **`lib/listings-repo.ts`** | The **only** module that knows where data comes from. Phase 1 reads the seed array; Phase 2 swaps these function bodies for Supabase queries with identical signatures: `getAllListings`, `getListingBySlug`, `queryListings`, `getStaticLandingParams`. All `async`. |

> **`lib/listings-repo.ts` is the single file Phase 2 swaps to move from seed
> data to Supabase.**

Pages, API routes, the sitemap and `generateStaticParams` import **only**
`lib/listings-repo.ts` for data access (and `lib/listings.ts` for
formatting/derivation). **Nothing else imports `content/listings.ts` directly.**

The seed array is validated once with **zod** (`lib/listings-schema.ts`) at repo
load, so Phase 2 database rows can be validated through the exact same contract.

---

## How listings work

- **Single seed file:** `content/listings.ts` — a typed `Listing[]`. ~36
  realistic Paraguayan listings (Asunción + Central, plus Encarnación and
  Ciudad del Este).
- **Image-filename contract:** each listing's `imagenes` array holds filenames
  that resolve to `/public/images/<name>`. The six featured listings have full
  8-image galleries (`prop1-1.jpg … prop6-8.jpg` = 48 files); the rest reuse
  that pool. Every image renders through `ImageWithFallback`, so missing files
  show a tasteful placeholder instead of breaking. See **`IMAGES.md`**.

### How to add a new listing

Copy a block in the `raw` array in `content/listings.ts` and fill every field:

| Field | Notes |
| --- | --- |
| `id` | Unique string. |
| `slug` | SEO slug, e.g. `casa-en-venta-villa-morra-asuncion-a1b2`. Must be unique. |
| `operacion` | `"venta"` or `"alquiler"`. |
| `tipo` | `"casa" \| "departamento" \| "duplex" \| "terreno" \| "oficina" \| "local"`. |
| `titulo` | Listing title (shown in Fraunces). |
| `descripcion` | 2–4 sentences in Spanish. |
| `precioUSD` | Price in US$. **`precioGs` is derived automatically** (`precioUSD × 7300`) — you do not set it. |
| `barrio`, `ciudad`, `departamento` | Real Paraguayan locations. |
| `dormitorios`, `banos`, `cocheras` | Integers (`0` for terreno). |
| `superficieConstruida`, `superficieTerreno` | m² (`0` where not applicable). |
| `caracteristicas` | String array, e.g. `["Piscina","Quincho","Seguridad 24hs"]`. |
| `coordenadas` | `{ lat, lng }` — roughly correct for the city. |
| `imagenes` | Filenames in `/public/images` (see the image contract above). |
| `destacada` | `true` to feature on the home page and show the `Destacada` badge. |
| `destacadaHasta` | ISO date or `null`. **Featured-slot expiry** — `isFeatured()` treats a listing as featured if `destacada === true` **or** `destacadaHasta` is a future date. This is the dormant rail for Phase 2 paid featured slots; in Phase 1 set `null` or a future date. |
| `fechaPublicacion` | ISO date — drives "Más recientes" sorting. |
| `inmobiliaria` | `{ nombre, telefono }` — `telefono` in `+595 9xx xxx xxx` format for `wa.me`. |

Adding a listing automatically updates the results pages, the relevant
programmatic SEO landing pages, the sitemap and the API — no other edits needed.

### How to add or replace photos

1. Generate an image to the **exact filename** listed in `IMAGES.md`
   (e.g. `prop1-3.jpg`).
2. Drop it into **`public/images/`** and commit it.
3. It auto-attaches — every listing referencing that filename now shows the real
   photo. A filename typo is the only way it "fails" (you keep seeing the
   placeholder).

Images live **in the repo** (committed to git) because Hostinger's app
filesystem is ephemeral. That's why Phase 1 has no uploads — and why Phase 2
user uploads go to object storage (Cloudflare R2), not the host disk.

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home: hero search → featured listings → top-lists → neighborhoods band. |
| `/comprar`, `/alquilar` | Results (all types), filterable, list + map toggle. Arbitrary query-param filtering. |
| `/comprar/[tipo]`, `/comprar/[tipo]/[lugar]` | Same Results component + SEO furniture (unique H1, intro, title/meta, JSON-LD). Same for `/alquilar/...`. |
| `/propiedad/[slug]` | Listing detail + full-screen accessible gallery. |
| `/guardados` | Saved listings (reads `localStorage`, no backend). |
| `/api/v1/listings`, `/api/v1/listings/[slug]` | Read-only JSON API (see below). |
| `/sitemap.xml`, `/robots.txt` | Generated from the data. |

Results and SEO-landing pages are **one component**. The path segments preset
`operacion` / `tipo` / `lugar`; everything else (price, rooms, características,
sort) lives in query params, so URLs stay shareable. `generateStaticParams`
emits only the `tipo` and `tipo/lugar` combos that have **≥1 listing**; empty
combos are not generated and are excluded from the sitemap (noindex by
omission).

---

## Read API contract

Phase 1 is **read-only and forward-compatible** — Phase 2 swaps the repo source
for a DB behind the same contract.

- `GET /api/v1/listings` — accepts the same filter/sort query params as the
  results page (`operacion`, `tipo`, `lugar`, `precioMin/Max`, `dormitorios`,
  `banos`, `superficieMin/Max`, `caracteristicas`, `sort`, `page`, `perPage`).
  Inputs validated with zod. Returns `{ data, meta }`.
- `GET /api/v1/listings/[slug]` — one listing or `404`.

Both go through `lib/listings-repo.ts` (never the seed array directly). **This is
the surface the Phase 2 admin/app will extend.**

> Lead capture + GoHighLevel/Google Sheets fan-out arrives in Phase 2. Phase 1
> captures no leads server-side — WhatsApp is the only channel.

---

## Environment variables

The site runs with all of these **unset**, degrading gracefully. See
`.env.example`.

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # production: https://vivienda.com.py
NEXT_PUBLIC_SITE_NAME=Vivienda Paraguay
NEXT_PUBLIC_WHATSAPP_NUMBER=595000000000     # fallback contact if a listing has none
NEXT_PUBLIC_FX_PYG_USD=7300                  # display conversion rate
```

(Phase 2 will add Supabase, R2, GHL and Sheets keys — not present now.)

---

## Deploy — Hostinger managed Node.js Web App

Standard `next build` / `next start`. **Never** `output: 'export'`.

1. hPanel → **Websites → Add Website → Node.js Apps → Import Git Repository**
2. Branch **`main`** → **Next.js** preset auto-detected → root **`./`**
3. **Node version = 22.x** (current LTS)
4. Add the env vars from `.env.example`
5. **Deploy** → attach the domain

Every merge to `main` auto-redeploys. A simple CI step is enough:
`npm ci && npm run build`.

**Note:** Hostinger's app filesystem is ephemeral, so seed images live in the
repo (`public/images`, committed to git). That's why Phase 1 has no uploads, and
why Phase 2 user uploads go to object storage (R2), not the host disk.

---

## When to start Phase 2

Editing the seed file is perfectly fine for **curated, low-volume** listings.
The trigger to start Phase 2 is **regular daily edits** or **onboarding the
first realtor** — that's when a database and self-serve posting pay off.

### Phase 2 roadmap (listing platform, full)

- **Supabase** (Postgres + Auth) behind the existing `lib/listings-repo.ts`
  contract.
- **Agency accounts + self-serve posting** with a
  `draft → pending_review → published → paused → expired` status machine (new
  posters moderated via the Supabase table editor — no custom admin panel at
  launch).
- **Featured slots + poster plans** monetization (the `destacadaHasta` rail goes
  live).
- **Lead-capture orchestrator** with GoHighLevel + Google Sheets fan-out
  (`Promise.allSettled`, retries, never blocks the user).
- **Cloudflare R2** presigned image uploads (never-block).
- **Expanded programmatic SEO** from live data.

Seekers still browse and contact **without accounts**, now and later — account
friction kills leads.
