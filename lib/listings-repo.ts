/**
 * THE DATA-SOURCE SEAM.
 *
 * This is the single module that knows WHERE listing data comes from. In
 * Phase 1 it reads the typed seed array from content/listings.ts (validated
 * once with zod). In Phase 2 the bodies below are replaced with Supabase
 * queries — the exported signatures stay identical, so pages, API routes,
 * the sitemap and generateStaticParams never change.
 *
 * Everything is async even though the Phase 1 read is synchronous, so the
 * contract already matches an async database.
 *
 * RULE: only this file imports content/listings.* . Nothing else may.
 */

import { listings as seed } from "@/content/listings";
import {
  listingsSchema,
  type Listing,
  type ListingQuery,
} from "./listings-schema";
import {
  filterListings,
  getLandingCombos,
  operacionToRouteBase,
  sortListings,
} from "./listings";

/** Validate the seed once at module load. Fail loud in dev if it's malformed. */
const validated: Listing[] = listingsSchema.parse(seed);

export async function getAllListings(): Promise<Listing[]> {
  return validated;
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  return validated.find((l) => l.slug === slug) ?? null;
}

export async function queryListings(
  params: ListingQuery
): Promise<{ items: Listing[]; total: number }> {
  const filtered = filterListings(validated, params);
  const sorted = sortListings(filtered, params.sort ?? "relevancia");
  const total = sorted.length;

  const page = params.page ?? 1;
  const perPage = params.perPage ?? (total || 1);
  const start = (page - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  return { items, total };
}

/**
 * Static landing params for generateStaticParams + the sitemap. Only combos
 * with ≥1 listing are returned; empty combos are omitted (noindex by omission).
 * `operacion` is expressed as its route base (comprar/alquilar) so callers can
 * map straight onto the URL tree.
 */
export async function getStaticLandingParams(): Promise<
  { operacion: string; tipo: string; lugar?: string }[]
> {
  const combos = getLandingCombos(validated);
  return combos.map((c) => ({
    operacion: operacionToRouteBase(c.operacion),
    tipo: c.tipo,
    ...(c.lugar ? { lugar: c.lugar } : {}),
  }));
}
