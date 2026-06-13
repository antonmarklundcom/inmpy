/**
 * Translate between URL search params and the typed ListingQuery contract.
 * Used by the results pages (client) and the read API (server) so a results
 * URL and an API URL accept exactly the same params.
 */

import {
  listingQuerySchema,
  tipoSchema,
  type ListingQuery,
  type Tipo,
} from "./listings-schema";

type ParamsLike = URLSearchParams | Record<string, string | string[] | undefined>;

function get(params: ParamsLike, key: string): string | undefined {
  if (params instanceof URLSearchParams) {
    return params.get(key) ?? undefined;
  }
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

function getAll(params: ParamsLike, key: string): string[] {
  if (params instanceof URLSearchParams) {
    return params.getAll(key);
  }
  const v = params[key];
  if (Array.isArray(v)) return v;
  return v != null ? [v] : [];
}

function num(value: string | undefined): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Parse loose URL params into a validated ListingQuery (drops bad values). */
export function parseListingQuery(params: ParamsLike): ListingQuery {
  // tipo can arrive as repeated params or a comma list.
  const tipoRaw = [
    ...getAll(params, "tipo"),
    ...((get(params, "tipo")?.includes(",")
      ? get(params, "tipo")!.split(",")
      : []) as string[]),
  ];
  const tipo = Array.from(
    new Set(
      tipoRaw
        .map((t) => t.trim())
        .filter(Boolean)
        .filter((t): t is Tipo => tipoSchema.safeParse(t).success)
    )
  );

  const caracteristicasRaw = [
    ...getAll(params, "caracteristicas"),
    ...((get(params, "caracteristicas")?.includes(",")
      ? get(params, "caracteristicas")!.split(",")
      : []) as string[]),
  ];
  const caracteristicas = Array.from(
    new Set(caracteristicasRaw.map((c) => c.trim()).filter(Boolean))
  );

  const candidate = {
    operacion: get(params, "operacion"),
    tipo: tipo.length ? tipo : undefined,
    lugar: get(params, "lugar") || undefined,
    precioMin: num(get(params, "precioMin")),
    precioMax: num(get(params, "precioMax")),
    dormitorios: num(get(params, "dormitorios")),
    banos: num(get(params, "banos")),
    superficieMin: num(get(params, "superficieMin")),
    superficieMax: num(get(params, "superficieMax")),
    caracteristicas: caracteristicas.length ? caracteristicas : undefined,
    sort: get(params, "sort"),
    page: num(get(params, "page")),
    perPage: num(get(params, "perPage")),
  };

  const result = listingQuerySchema.safeParse(candidate);
  return result.success ? result.data : {};
}

/** Serialize a ListingQuery to a URLSearchParams (stable, shareable URLs). */
export function serializeListingQuery(query: ListingQuery): URLSearchParams {
  const sp = new URLSearchParams();
  if (query.operacion) sp.set("operacion", query.operacion);
  if (query.tipo?.length) sp.set("tipo", query.tipo.join(","));
  if (query.lugar) sp.set("lugar", query.lugar);
  if (query.precioMin != null) sp.set("precioMin", String(query.precioMin));
  if (query.precioMax != null) sp.set("precioMax", String(query.precioMax));
  if (query.dormitorios != null) sp.set("dormitorios", String(query.dormitorios));
  if (query.banos != null) sp.set("banos", String(query.banos));
  if (query.superficieMin != null)
    sp.set("superficieMin", String(query.superficieMin));
  if (query.superficieMax != null)
    sp.set("superficieMax", String(query.superficieMax));
  if (query.caracteristicas?.length)
    sp.set("caracteristicas", query.caracteristicas.join(","));
  if (query.sort) sp.set("sort", query.sort);
  if (query.page != null) sp.set("page", String(query.page));
  if (query.perPage != null) sp.set("perPage", String(query.perPage));
  return sp;
}
