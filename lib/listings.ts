import { FX_PYG_USD } from './config';
import type { Listing, ListingQuery, SortKey } from './types';
import { OPERACION_TO_SLUG, TIPO_TO_SLUG } from './taxonomy';

/**
 * Pure, source-agnostic logic over already-loaded listing data.
 *
 * IMPORTANT: This module must never import the seed file or do any I/O.
 * It only transforms / formats / derives over data handed to it. That keeps
 * it trivially testable and reusable on either side of the Phase 2 swap.
 */

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

const nfPY = new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 });

export function formatUSD(value: number): string {
  return `US$ ${nfPY.format(Math.round(value))}`;
}

export function formatGs(value: number): string {
  return `Gs. ${nfPY.format(Math.round(value))}`;
}

/** Both currencies from a single USD figure, using the fixed FX constant. */
export function formatDualPrice(precioUSD: number): { usd: string; gs: string } {
  return {
    usd: formatUSD(precioUSD),
    gs: formatGs(precioUSD * FX_PYG_USD),
  };
}

export function formatArea(m2: number): string {
  return `${nfPY.format(Math.round(m2))} m²`;
}

// ---------------------------------------------------------------------------
// Slugs
// ---------------------------------------------------------------------------

/** Accent-folding, lowercase, hyphenated slug. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------------------------------------------------------------------------
// Featured
// ---------------------------------------------------------------------------

/**
 * A listing is featured if explicitly flagged, or if its paid featured slot
 * (`destacadaHasta`) is still in the future. This is the dormant rail for
 * Phase 2 paid featured slots — the mechanic exists, monetization does not.
 */
export function isFeatured(listing: Listing, now: Date = new Date()): boolean {
  if (listing.destacada) return true;
  if (listing.destacadaHasta) {
    return new Date(listing.destacadaHasta) > now;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

function matchesUbicacion(listing: Listing, query: string): boolean {
  const haystack = `${listing.barrio} ${listing.ciudad} ${listing.departamento}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase();
  const needle = query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .trim();
  if (!needle) return true;
  // Match on any whitespace-separated token so "villa morra" and the slug
  // "villa-morra" (passed un-hyphenated) both work.
  return needle
    .split(/[\s-]+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

export function filterListings(
  listings: Listing[],
  filters: ListingQuery,
): Listing[] {
  return listings.filter((l) => {
    if (filters.operacion && l.operacion !== filters.operacion) return false;
    if (filters.tipo && filters.tipo.length > 0 && !filters.tipo.includes(l.tipo)) {
      return false;
    }
    if (filters.ubicacion && !matchesUbicacion(l, filters.ubicacion)) return false;
    if (filters.precioMinUSD != null && l.precioUSD < filters.precioMinUSD) {
      return false;
    }
    if (filters.precioMaxUSD != null && l.precioUSD > filters.precioMaxUSD) {
      return false;
    }
    if (filters.dormitoriosMin != null && l.dormitorios < filters.dormitoriosMin) {
      return false;
    }
    if (filters.banosMin != null && l.banos < filters.banosMin) return false;
    const superficie = l.superficieConstruida || l.superficieTerreno;
    if (filters.superficieMin != null && superficie < filters.superficieMin) {
      return false;
    }
    if (filters.superficieMax != null && superficie > filters.superficieMax) {
      return false;
    }
    if (filters.caracteristicas && filters.caracteristicas.length > 0) {
      const set = new Set(l.caracteristicas);
      if (!filters.caracteristicas.every((c) => set.has(c))) return false;
    }
    return true;
  });
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export function sortListings(
  listings: Listing[],
  sort: SortKey = 'relevancia',
  now: Date = new Date(),
): Listing[] {
  const copy = [...listings];
  switch (sort) {
    case 'precio-asc':
      return copy.sort((a, b) => a.precioUSD - b.precioUSD);
    case 'precio-desc':
      return copy.sort((a, b) => b.precioUSD - a.precioUSD);
    case 'recientes':
      return copy.sort(
        (a, b) =>
          new Date(b.fechaPublicacion).getTime() -
          new Date(a.fechaPublicacion).getTime(),
      );
    case 'superficie':
      return copy.sort(
        (a, b) =>
          (b.superficieConstruida || b.superficieTerreno) -
          (a.superficieConstruida || a.superficieTerreno),
      );
    case 'relevancia':
    default:
      // Featured first, then most recent.
      return copy.sort((a, b) => {
        const fa = isFeatured(a, now) ? 1 : 0;
        const fb = isFeatured(b, now) ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return (
          new Date(b.fechaPublicacion).getTime() -
          new Date(a.fechaPublicacion).getTime()
        );
      });
  }
}

// ---------------------------------------------------------------------------
// Top lists (home page rails)
// ---------------------------------------------------------------------------

export type TopListKind =
  | 'mas-caras-venta'
  | 'departamentos-recientes'
  | 'casas-alquiler';

export function getTopList(
  listings: Listing[],
  kind: TopListKind,
  limit = 5,
): Listing[] {
  switch (kind) {
    case 'mas-caras-venta':
      return [...listings]
        .filter((l) => l.operacion === 'venta')
        .sort((a, b) => b.precioUSD - a.precioUSD)
        .slice(0, limit);
    case 'departamentos-recientes':
      return [...listings]
        .filter((l) => l.tipo === 'departamento')
        .sort(
          (a, b) =>
            new Date(b.fechaPublicacion).getTime() -
            new Date(a.fechaPublicacion).getTime(),
        )
        .slice(0, limit);
    case 'casas-alquiler':
      return [...listings]
        .filter((l) => l.tipo === 'casa' && l.operacion === 'alquiler')
        .sort(
          (a, b) =>
            new Date(b.fechaPublicacion).getTime() -
            new Date(a.fechaPublicacion).getTime(),
        )
        .slice(0, limit);
    default:
      return [];
  }
}

// ---------------------------------------------------------------------------
// Landing-page combos
// ---------------------------------------------------------------------------

export interface LandingCombo {
  operacion: string; // url segment: comprar | alquilar
  tipo: string; // url segment: casas | departamentos | ...
  lugar?: string; // url segment: villa-morra | asuncion | ...
}

/**
 * Every operacion+tipo and operacion+tipo+lugar combination that has at least
 * one matching listing. Used by `generateStaticParams` and the sitemap so we
 * only emit landing pages that actually have inventory (noindex by omission).
 */
export function getLandingCombos(listings: Listing[]): LandingCombo[] {
  const tipoCombos = new Set<string>();
  const lugarCombos = new Set<string>();

  for (const l of listings) {
    const op = OPERACION_TO_SLUG[l.operacion];
    const tipo = TIPO_TO_SLUG[l.tipo];
    tipoCombos.add(`${op}|${tipo}`);
    // Landing places: city slug + barrio slug (when present).
    const lugares = [slugify(l.ciudad)];
    if (l.barrio) lugares.push(slugify(l.barrio));
    for (const lugar of lugares) {
      lugarCombos.add(`${op}|${tipo}|${lugar}`);
    }
  }

  const result: LandingCombo[] = [];
  for (const key of tipoCombos) {
    const [operacion, tipo] = key.split('|');
    result.push({ operacion: operacion!, tipo: tipo! });
  }
  for (const key of lugarCombos) {
    const [operacion, tipo, lugar] = key.split('|');
    result.push({ operacion: operacion!, tipo: tipo!, lugar: lugar! });
  }
  return result;
}

// ---------------------------------------------------------------------------
// Misc derivations
// ---------------------------------------------------------------------------

export function priceRangeUSD(listings: Listing[]): { min: number; max: number } | null {
  if (listings.length === 0) return null;
  let min = Infinity;
  let max = -Infinity;
  for (const l of listings) {
    if (l.precioUSD < min) min = l.precioUSD;
    if (l.precioUSD > max) max = l.precioUSD;
  }
  return { min, max };
}

/** Listings of the same tipo and city/barrio, excluding the given one. */
export function similarListings(
  listings: Listing[],
  target: Listing,
  limit = 4,
): Listing[] {
  const sameZone = listings.filter(
    (l) =>
      l.id !== target.id &&
      l.tipo === target.tipo &&
      (l.ciudad === target.ciudad || l.barrio === target.barrio),
  );
  if (sameZone.length >= limit) return sameZone.slice(0, limit);
  // Backfill with same-tipo listings elsewhere.
  const sameTipo = listings.filter(
    (l) => l.id !== target.id && l.tipo === target.tipo && !sameZone.includes(l),
  );
  return [...sameZone, ...sameTipo].slice(0, limit);
}

export const fmt = { formatUSD, formatGs, formatArea };
