import type { Metadata } from 'next';
import { getAllListings } from './listings-repo';
import { filterListings, priceRangeUSD, formatUSD, slugify } from './listings';
import {
  OPERACION_TO_SLUG,
  TIPO_PLURAL,
  operacionFromSlug,
  tipoFromSlug,
} from './taxonomy';
import type { Listing, ListingQuery, Operacion, Tipo } from './types';
import { SITE_NAME, SITE_URL } from './config';

/**
 * Shared resolution + SEO-copy generation for the results / landing pages.
 * `/comprar`, `/comprar/[tipo]`, and `/comprar/[tipo]/[lugar]` are all the same
 * results surface; the path segments preset part of the query and (on the
 * deeper routes) add SEO furniture generated from the data.
 */

export interface LandingContext {
  operacion: Operacion;
  operacionSlug: string;
  tipo: Tipo | null;
  /** Display label for the place (e.g. "Villa Morra"), resolved from data. */
  lugarLabel: string | null;
  lugarSlug: string | null;
  /** Query fixed by the path (operacion + maybe tipo + maybe ubicacion). */
  presetQuery: ListingQuery;
  /** Whether this route shows SEO furniture (H1 + intro) — true on [tipo] routes. */
  isLanding: boolean;
  h1: string;
  intro: string;
  canonicalPath: string;
}

/** Find the human label for a place slug by scanning the data's barrios/ciudades. */
async function resolveLugarLabel(lugarSlug: string): Promise<string | null> {
  const all = await getAllListings();
  for (const l of all) {
    if (l.barrio && slugify(l.barrio) === lugarSlug) return l.barrio;
    if (slugify(l.ciudad) === lugarSlug) return l.ciudad;
  }
  return null;
}

/**
 * Resolve a route into a LandingContext, or `null` if a path segment is
 * invalid (caller should 404).
 */
export async function resolveLanding(args: {
  operacionSlug: string;
  tipoSlug?: string;
  lugarSlug?: string;
}): Promise<LandingContext | null> {
  const operacion = operacionFromSlug(args.operacionSlug);
  if (!operacion) return null;

  let tipo: Tipo | null = null;
  if (args.tipoSlug) {
    tipo = tipoFromSlug(args.tipoSlug);
    if (!tipo) return null;
  }

  let lugarLabel: string | null = null;
  if (args.lugarSlug) {
    lugarLabel = await resolveLugarLabel(args.lugarSlug);
    if (!lugarLabel) return null;
  }

  const presetQuery: ListingQuery = { operacion };
  if (tipo) presetQuery.tipo = [tipo];
  if (lugarLabel) presetQuery.ubicacion = lugarLabel;

  const isLanding = Boolean(tipo); // [tipo] and [tipo]/[lugar] routes
  const { h1, intro } = await buildSeoCopy(operacion, tipo, lugarLabel, presetQuery);

  const canonicalPath = [
    `/${args.operacionSlug}`,
    args.tipoSlug,
    args.lugarSlug,
  ]
    .filter(Boolean)
    .join('/');

  return {
    operacion,
    operacionSlug: args.operacionSlug,
    tipo,
    lugarLabel,
    lugarSlug: args.lugarSlug ?? null,
    presetQuery,
    isLanding,
    h1,
    intro,
    canonicalPath,
  };
}

const OPERACION_LABEL: Record<Operacion, string> = {
  venta: 'en venta',
  alquiler: 'en alquiler',
};

async function buildSeoCopy(
  operacion: Operacion,
  tipo: Tipo | null,
  lugarLabel: string | null,
  presetQuery: ListingQuery,
): Promise<{ h1: string; intro: string }> {
  const all = await getAllListings();
  const matching = filterListings(all, presetQuery);
  const count = matching.length;
  const range = priceRangeUSD(matching);

  const tipoLabel = tipo ? TIPO_PLURAL[tipo] : 'Propiedades';
  const opLabel = OPERACION_LABEL[operacion];
  const place = lugarLabel ? ` en ${lugarLabel}` : ' en Paraguay';

  const h1 = `${tipoLabel} ${opLabel}${place}`;

  let intro = `Explorá ${count} ${
    count === 1 ? 'propiedad disponible' : 'propiedades disponibles'
  } de ${tipoLabel.toLowerCase()} ${opLabel}${place}.`;
  if (range) {
    intro +=
      range.min === range.max
        ? ` Precio: ${formatUSD(range.min)}.`
        : ` Precios desde ${formatUSD(range.min)} hasta ${formatUSD(range.max)}.`;
  }
  intro += ` En Vivienda Paraguay las encontrás de la forma más tranquila y agradable, con galería de fotos y contacto directo por WhatsApp.`;

  return { h1, intro };
}

/** Build per-page metadata for a landing route. */
export async function buildLandingMetadata(
  ctx: LandingContext,
): Promise<Metadata> {
  const title = ctx.isLanding
    ? ctx.h1
    : ctx.operacion === 'venta'
      ? 'Propiedades en venta en Paraguay'
      : 'Propiedades en alquiler en Paraguay';
  const description = ctx.intro;
  const url = `${SITE_URL}/${ctx.canonicalPath.replace(/^\//, '')}`;

  return {
    title,
    description,
    alternates: { canonical: `/${ctx.canonicalPath.replace(/^\//, '')}` },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url,
      type: 'website',
    },
  };
}

export interface ResultsData {
  items: Listing[];
  total: number;
}

/** The full effective query = path presets merged with parsed query params. */
export function mergeQuery(
  preset: ListingQuery,
  parsed: ListingQuery,
): ListingQuery {
  return {
    ...parsed,
    operacion: preset.operacion ?? parsed.operacion,
    // Path tipo wins; otherwise use parsed tipo chips.
    tipo: preset.tipo ?? parsed.tipo,
    ubicacion: preset.ubicacion ?? parsed.ubicacion,
  };
}

export { OPERACION_TO_SLUG };
