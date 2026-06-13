/**
 * Builds SEO furniture (H1, intro paragraph, <title>/meta) for the programmatic
 * landing pages. Pure: derives everything from the listings handed in, so empty
 * combos never produce a page (the caller checks `count`).
 */

import type { Listing } from "./listings-schema";
import {
  PLURAL_TO_TIPO,
  TIPO_LABEL,
  formatUSD,
  slugify,
} from "./listings";

export interface LandingParams {
  operacion: "venta" | "alquiler";
  tipoPlural: string; // e.g. "casas"
  lugarSlug?: string; // e.g. "villa-morra"
}

export interface LandingContent {
  count: number;
  h1: string;
  intro: string;
  title: string;
  description: string;
  lugarLabel?: string;
  tipoLabel: string;
}

/** Resolve a place slug back to its display name using the listing data. */
export function resolveLugarLabel(
  listings: Listing[],
  lugarSlug: string
): string | undefined {
  for (const l of listings) {
    if (slugify(l.barrio) === lugarSlug) return l.barrio;
    if (slugify(l.ciudad) === lugarSlug) return l.ciudad;
  }
  return undefined;
}

export function buildLandingContent(
  listings: Listing[],
  params: LandingParams
): LandingContent {
  const tipo = PLURAL_TO_TIPO[params.tipoPlural];
  const tipoLabel = tipo ? TIPO_LABEL[tipo].plural : "Propiedades";
  const opLabel = params.operacion === "venta" ? "en venta" : "en alquiler";
  const lugarLabel = params.lugarSlug
    ? resolveLugarLabel(listings, params.lugarSlug)
    : undefined;

  const matching = listings.filter((l) => {
    if (tipo && l.tipo !== tipo) return false;
    if (l.operacion !== params.operacion) return false;
    if (params.lugarSlug) {
      const inPlace =
        slugify(l.barrio) === params.lugarSlug ||
        slugify(l.ciudad) === params.lugarSlug;
      if (!inPlace) return false;
    }
    return true;
  });

  const count = matching.length;
  const placeSuffix = lugarLabel ? ` en ${lugarLabel}` : " en Paraguay";

  const h1 = `${tipoLabel} ${opLabel}${placeSuffix}`;

  let intro: string;
  if (count > 0) {
    const prices = matching.map((l) => l.precioUSD).sort((a, b) => a - b);
    const min = prices[0]!;
    const max = prices[prices.length - 1]!;
    const rangeText =
      min === max
        ? `desde ${formatUSD(min)}`
        : `desde ${formatUSD(min)} hasta ${formatUSD(max)}`;
    const verbo = params.operacion === "venta" ? "en venta" : "en alquiler";
    intro = `Explorá ${count} ${
      count === 1 ? "propiedad" : "propiedades"
    } de tipo ${tipoLabel.toLowerCase()} ${verbo}${placeSuffix}, con precios ${rangeText}. Encontrá tu próxima propiedad con la búsqueda más calma y agradable de Paraguay.`;
  } else {
    intro = `Todavía no hay ${tipoLabel.toLowerCase()} ${opLabel}${placeSuffix}. Probá ampliar tu búsqueda o explorá otras zonas.`;
  }

  const title = `${h1} | Vivienda Paraguay`;
  const description =
    count > 0
      ? `${count} ${tipoLabel.toLowerCase()} ${opLabel}${placeSuffix}. Fotos, precios en Gs. y US$, ubicación y contacto directo por WhatsApp.`
      : `${tipoLabel} ${opLabel}${placeSuffix} en Vivienda Paraguay.`;

  return { count, h1, intro, title, description, lugarLabel, tipoLabel };
}
