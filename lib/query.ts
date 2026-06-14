import type { ListingQuery, SortKey, Tipo } from './types';
import { SLUG_TO_TIPO, TIPO_TO_SLUG } from './taxonomy';

/**
 * Bidirectional mapping between URL query params and the typed `ListingQuery`.
 * Keeping this in one place means the results UI and the read API agree on the
 * exact param names, so URLs stay shareable across both.
 *
 * Param names (all optional):
 *   operacion, tipo (repeatable or comma-list), ubicacion,
 *   precioMin, precioMax (USD), dormitorios, banos, supMin, supMax,
 *   caracteristicas (repeatable or comma-list), sort, page, pageSize
 */

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

function getAll(params: Params, key: string): string[] {
  if (params instanceof URLSearchParams) {
    return params.getAll(key);
  }
  const v = params[key];
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function getOne(params: Params, key: string): string | undefined {
  const all = getAll(params, key);
  return all[0];
}

function splitList(values: string[]): string[] {
  return values
    .flatMap((v) => v.split(','))
    .map((v) => v.trim())
    .filter(Boolean);
}

function num(value: string | undefined): number | undefined {
  if (value == null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

const SORT_VALUES: SortKey[] = [
  'relevancia',
  'precio-asc',
  'precio-desc',
  'recientes',
  'superficie',
];

export function parseListingQuery(params: Params): ListingQuery {
  const query: ListingQuery = {};

  const operacion = getOne(params, 'operacion');
  if (operacion === 'venta' || operacion === 'alquiler') query.operacion = operacion;

  const tipoSlugs = splitList(getAll(params, 'tipo'));
  const tipos = tipoSlugs
    .map((slug) => SLUG_TO_TIPO[slug])
    .filter((t): t is Tipo => Boolean(t));
  if (tipos.length > 0) query.tipo = tipos;

  const ubicacion = getOne(params, 'ubicacion');
  if (ubicacion) query.ubicacion = ubicacion;

  query.precioMinUSD = num(getOne(params, 'precioMin'));
  query.precioMaxUSD = num(getOne(params, 'precioMax'));
  query.dormitoriosMin = num(getOne(params, 'dormitorios'));
  query.banosMin = num(getOne(params, 'banos'));
  query.superficieMin = num(getOne(params, 'supMin'));
  query.superficieMax = num(getOne(params, 'supMax'));

  const caracteristicas = splitList(getAll(params, 'caracteristicas'));
  if (caracteristicas.length > 0) query.caracteristicas = caracteristicas;

  const sort = getOne(params, 'sort') as SortKey | undefined;
  if (sort && SORT_VALUES.includes(sort)) query.sort = sort;

  query.page = num(getOne(params, 'page'));
  query.pageSize = num(getOne(params, 'pageSize'));

  // Strip undefined keys for a clean object.
  return Object.fromEntries(
    Object.entries(query).filter(([, v]) => v !== undefined),
  ) as ListingQuery;
}

/** Serialize a ListingQuery back into a URLSearchParams (for shareable links). */
export function serializeListingQuery(query: ListingQuery): URLSearchParams {
  const sp = new URLSearchParams();
  if (query.operacion) sp.set('operacion', query.operacion);
  if (query.tipo && query.tipo.length) {
    sp.set('tipo', query.tipo.map((t) => TIPO_TO_SLUG[t]).join(','));
  }
  if (query.ubicacion) sp.set('ubicacion', query.ubicacion);
  if (query.precioMinUSD != null) sp.set('precioMin', String(query.precioMinUSD));
  if (query.precioMaxUSD != null) sp.set('precioMax', String(query.precioMaxUSD));
  if (query.dormitoriosMin != null) sp.set('dormitorios', String(query.dormitoriosMin));
  if (query.banosMin != null) sp.set('banos', String(query.banosMin));
  if (query.superficieMin != null) sp.set('supMin', String(query.superficieMin));
  if (query.superficieMax != null) sp.set('supMax', String(query.superficieMax));
  if (query.caracteristicas && query.caracteristicas.length) {
    for (const c of query.caracteristicas) sp.append('caracteristicas', c);
  }
  if (query.sort && query.sort !== 'relevancia') sp.set('sort', query.sort);
  return sp;
}
