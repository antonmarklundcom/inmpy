import 'server-only';
import { listingsSeed } from '@/content/listings';
import { listingsSchema } from './listings-schema';
import { filterListings, getLandingCombos, sortListings } from './listings';
import { OPERACION_TO_SLUG } from './taxonomy';
import type { Listing, ListingQuery } from './types';

/**
 * THE DATA-SOURCE SEAM — the single file Phase 2 swaps to move from seed data
 * to Supabase.
 *
 * This is the ONLY module that knows where listing data comes from. Pages, API
 * routes, the sitemap, and `generateStaticParams` import data exclusively from
 * here. In Phase 2 these function bodies become Supabase queries; the exported
 * signatures stay identical, so nothing downstream changes.
 *
 * Every function is `async` even though the Phase 1 read is synchronous — the
 * contract already matches an async database.
 */

// Validate the seed once at module load. A malformed seed entry fails loudly
// here rather than silently rendering broken cards.
let cache: Listing[] | null = null;

function loadAll(): Listing[] {
  if (cache) return cache;
  const parsed = listingsSchema.safeParse(listingsSeed);
  if (!parsed.success) {
    throw new Error(
      `Seed data failed validation: ${parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ')}`,
    );
  }
  cache = parsed.data as Listing[];
  return cache;
}

export async function getAllListings(): Promise<Listing[]> {
  return loadAll();
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const all = loadAll();
  return all.find((l) => l.slug === slug) ?? null;
}

export async function queryListings(
  params: ListingQuery,
): Promise<{ items: Listing[]; total: number }> {
  const all = loadAll();
  const filtered = filterListings(all, params);
  const sorted = sortListings(filtered, params.sort);
  const total = sorted.length;

  if (params.page != null && params.pageSize != null) {
    const start = (params.page - 1) * params.pageSize;
    return { items: sorted.slice(start, start + params.pageSize), total };
  }
  return { items: sorted, total };
}

export async function getStaticLandingParams(): Promise<
  { operacion: string; tipo: string; lugar?: string }[]
> {
  const all = loadAll();
  return getLandingCombos(all);
}

/**
 * Convenience: all distinct características present in the data, for building
 * the results-page filter checkboxes from real inventory.
 */
export async function getAllCaracteristicas(): Promise<string[]> {
  const all = loadAll();
  const set = new Set<string>();
  for (const l of all) for (const c of l.caracteristicas) set.add(c);
  return [...set].sort((a, b) => a.localeCompare(b, 'es'));
}

/** Distinct operacion+tipo+ciudad combos used for the home "Explorá por zona" band. */
export async function getZonas(): Promise<
  { ciudad: string; barrio: string; count: number }[]
> {
  const all = loadAll();
  const map = new Map<string, { ciudad: string; barrio: string; count: number }>();
  for (const l of all) {
    const key = `${l.ciudad}|${l.barrio}`;
    const existing = map.get(key);
    if (existing) existing.count += 1;
    else map.set(key, { ciudad: l.ciudad, barrio: l.barrio, count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export { OPERACION_TO_SLUG };
