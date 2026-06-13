/**
 * Pure, source-agnostic logic over already-loaded listing data.
 *
 * This module NEVER imports the seed file and performs NO I/O. It only
 * transforms / derives from arrays of Listing that are handed to it. Phase 2
 * keeps this file untouched — only lib/listings-repo.ts changes its source.
 */

import { FX_PYG_USD, LOCALE } from "./config";
import type { Listing, ListingQuery, Sort, Tipo } from "./listings-schema";

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

const numberFmt = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });

export function formatUSD(precioUSD: number): string {
  return `US$ ${numberFmt.format(Math.round(precioUSD))}`;
}

export function formatGs(precioGs: number): string {
  return `Gs. ${numberFmt.format(Math.round(precioGs))}`;
}

export function gsFromUSD(precioUSD: number): number {
  return Math.round(precioUSD * FX_PYG_USD);
}

/** Dual price string used wherever a price is shown. */
export function formatDualPrice(precioUSD: number): { usd: string; gs: string } {
  return { usd: formatUSD(precioUSD), gs: formatGs(gsFromUSD(precioUSD)) };
}

export function formatArea(m2: number): string {
  return `${numberFmt.format(Math.round(m2))} m²`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/* ------------------------------------------------------------------ */
/* Slugs & labels                                                      */
/* ------------------------------------------------------------------ */

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Singular tipo -> plural route slug, e.g. "casa" -> "casas". */
export const TIPO_PLURAL: Record<Tipo, string> = {
  casa: "casas",
  departamento: "departamentos",
  duplex: "duplex",
  terreno: "terrenos",
  oficina: "oficinas",
  local: "locales",
};

export const PLURAL_TO_TIPO: Record<string, Tipo> = Object.entries(
  TIPO_PLURAL
).reduce((acc, [tipo, plural]) => {
  acc[plural] = tipo as Tipo;
  return acc;
}, {} as Record<string, Tipo>);

/** Human label for a tipo (singular / plural). */
export const TIPO_LABEL: Record<Tipo, { singular: string; plural: string }> = {
  casa: { singular: "Casa", plural: "Casas" },
  departamento: { singular: "Departamento", plural: "Departamentos" },
  duplex: { singular: "Dúplex", plural: "Dúplex" },
  terreno: { singular: "Terreno", plural: "Terrenos" },
  oficina: { singular: "Oficina", plural: "Oficinas" },
  local: { singular: "Local", plural: "Locales" },
};

export const OPERACION_LABEL = {
  venta: "venta",
  alquiler: "alquiler",
} as const;

/** The route base for an operación: venta -> comprar, alquiler -> alquilar. */
export function operacionToRouteBase(op: "venta" | "alquiler"): string {
  return op === "venta" ? "comprar" : "alquilar";
}

export function routeBaseToOperacion(base: string): "venta" | "alquiler" | null {
  if (base === "comprar") return "venta";
  if (base === "alquilar") return "alquiler";
  return null;
}

/* ------------------------------------------------------------------ */
/* Featured                                                            */
/* ------------------------------------------------------------------ */

export function isFeatured(listing: Listing): boolean {
  if (listing.destacada) return true;
  if (listing.destacadaHasta) {
    const until = new Date(listing.destacadaHasta);
    return !Number.isNaN(until.getTime()) && until > new Date();
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* Filtering                                                           */
/* ------------------------------------------------------------------ */

function matchesLugar(listing: Listing, lugar: string): boolean {
  const needle = slugify(lugar);
  if (!needle) return true;
  return [listing.barrio, listing.ciudad, listing.departamento]
    .map(slugify)
    .some((hay) => hay.includes(needle) || needle.includes(hay));
}

export function filterListings(
  listings: Listing[],
  filters: ListingQuery
): Listing[] {
  return listings.filter((l) => {
    if (filters.operacion && l.operacion !== filters.operacion) return false;
    if (filters.tipo && filters.tipo.length > 0 && !filters.tipo.includes(l.tipo))
      return false;
    if (filters.lugar && !matchesLugar(l, filters.lugar)) return false;
    if (filters.precioMin != null && l.precioUSD < filters.precioMin)
      return false;
    if (filters.precioMax != null && l.precioUSD > filters.precioMax)
      return false;
    if (filters.dormitorios != null && l.dormitorios < filters.dormitorios)
      return false;
    if (filters.banos != null && l.banos < filters.banos) return false;
    if (
      filters.superficieMin != null &&
      l.superficieConstruida < filters.superficieMin &&
      l.superficieTerreno < filters.superficieMin
    )
      return false;
    if (filters.superficieMax != null) {
      const area = l.superficieConstruida || l.superficieTerreno;
      if (area > filters.superficieMax) return false;
    }
    if (filters.caracteristicas && filters.caracteristicas.length > 0) {
      const have = new Set(l.caracteristicas.map(slugify));
      const need = filters.caracteristicas.map(slugify);
      if (!need.every((c) => have.has(c))) return false;
    }
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Sorting                                                             */
/* ------------------------------------------------------------------ */

export function sortListings(listings: Listing[], sort: Sort = "relevancia"): Listing[] {
  const arr = [...listings];
  switch (sort) {
    case "precio-asc":
      arr.sort((a, b) => a.precioUSD - b.precioUSD);
      break;
    case "precio-desc":
      arr.sort((a, b) => b.precioUSD - a.precioUSD);
      break;
    case "recientes":
      arr.sort(
        (a, b) =>
          new Date(b.fechaPublicacion).getTime() -
          new Date(a.fechaPublicacion).getTime()
      );
      break;
    case "superficie":
      arr.sort(
        (a, b) =>
          Math.max(b.superficieConstruida, b.superficieTerreno) -
          Math.max(a.superficieConstruida, a.superficieTerreno)
      );
      break;
    case "relevancia":
    default:
      // Featured first, then most recent.
      arr.sort((a, b) => {
        const fa = isFeatured(a) ? 1 : 0;
        const fb = isFeatured(b) ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return (
          new Date(b.fechaPublicacion).getTime() -
          new Date(a.fechaPublicacion).getTime()
        );
      });
      break;
  }
  return arr;
}

/* ------------------------------------------------------------------ */
/* Top lists (home page rails)                                         */
/* ------------------------------------------------------------------ */

export type TopListKind =
  | "mas-caras-venta"
  | "departamentos-recientes"
  | "casas-alquiler";

export function getTopList(
  listings: Listing[],
  kind: TopListKind,
  limit = 5
): Listing[] {
  switch (kind) {
    case "mas-caras-venta":
      return listings
        .filter((l) => l.operacion === "venta")
        .sort((a, b) => b.precioUSD - a.precioUSD)
        .slice(0, limit);
    case "departamentos-recientes":
      return listings
        .filter((l) => l.tipo === "departamento")
        .sort(
          (a, b) =>
            new Date(b.fechaPublicacion).getTime() -
            new Date(a.fechaPublicacion).getTime()
        )
        .slice(0, limit);
    case "casas-alquiler":
      return listings
        .filter((l) => l.tipo === "casa" && l.operacion === "alquiler")
        .sort(
          (a, b) =>
            new Date(b.fechaPublicacion).getTime() -
            new Date(a.fechaPublicacion).getTime()
        )
        .slice(0, limit);
    default:
      return [];
  }
}

/* ------------------------------------------------------------------ */
/* Landing-page combos                                                 */
/* ------------------------------------------------------------------ */

export interface LandingCombo {
  operacion: "venta" | "alquiler";
  tipo: string; // plural slug
  lugar?: string; // place slug
}

/**
 * Every operación/tipo and operación/tipo/lugar combo that has ≥1 listing.
 * Used for generateStaticParams and the sitemap (empty combos are omitted,
 * which is how they stay out of the index).
 */
export function getLandingCombos(listings: Listing[]): LandingCombo[] {
  const tipoCombos = new Set<string>(); // "op|tipoPlural"
  const tipoLugarCombos = new Set<string>(); // "op|tipoPlural|lugarSlug"

  for (const l of listings) {
    const tipoPlural = TIPO_PLURAL[l.tipo];
    tipoCombos.add(`${l.operacion}|${tipoPlural}`);
    // A listing contributes both its ciudad and barrio as place slugs.
    const places = new Set<string>();
    if (l.ciudad) places.add(slugify(l.ciudad));
    if (l.barrio) places.add(slugify(l.barrio));
    for (const place of places) {
      tipoLugarCombos.add(`${l.operacion}|${tipoPlural}|${place}`);
    }
  }

  const combos: LandingCombo[] = [];
  for (const key of tipoCombos) {
    const [operacion, tipo] = key.split("|");
    combos.push({
      operacion: operacion as "venta" | "alquiler",
      tipo: tipo as string,
    });
  }
  for (const key of tipoLugarCombos) {
    const [operacion, tipo, lugar] = key.split("|");
    combos.push({
      operacion: operacion as "venta" | "alquiler",
      tipo: tipo as string,
      lugar,
    });
  }
  return combos;
}

/* ------------------------------------------------------------------ */
/* Similar listings                                                    */
/* ------------------------------------------------------------------ */

export function getSimilarListings(
  listings: Listing[],
  current: Listing,
  limit = 4
): Listing[] {
  return listings
    .filter((l) => l.id !== current.id)
    .map((l) => {
      let score = 0;
      if (l.tipo === current.tipo) score += 3;
      if (l.operacion === current.operacion) score += 2;
      if (slugify(l.ciudad) === slugify(current.ciudad)) score += 2;
      if (slugify(l.barrio) === slugify(current.barrio)) score += 2;
      const priceRatio =
        current.precioUSD > 0
          ? Math.abs(l.precioUSD - current.precioUSD) / current.precioUSD
          : 1;
      if (priceRatio < 0.4) score += 1;
      return { l, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.l);
}

/* ------------------------------------------------------------------ */
/* WhatsApp deep link                                                  */
/* ------------------------------------------------------------------ */

export function buildWhatsAppLink(
  telefono: string,
  message: string
): string {
  const digits = telefono.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
