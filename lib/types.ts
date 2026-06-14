/**
 * Core domain types. These are the contract the whole app reads against —
 * pages, API routes, and the repository module all speak in `Listing`.
 *
 * In Phase 2 the *source* of these objects changes (Supabase), but the shape
 * stays identical, so nothing downstream of `lib/listings-repo.ts` changes.
 */

export type Operacion = 'venta' | 'alquiler';

export type Tipo =
  | 'casa'
  | 'departamento'
  | 'duplex'
  | 'terreno'
  | 'oficina'
  | 'local';

export interface Inmobiliaria {
  nombre: string;
  /** E.164-ish digits for wa.me, e.g. "595981234567". */
  telefono: string;
}

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;
  slug: string;
  operacion: Operacion;
  tipo: Tipo;
  titulo: string;
  descripcion: string;
  precioUSD: number;
  precioGs: number;
  barrio: string;
  ciudad: string;
  departamento: string;
  dormitorios: number;
  banos: number;
  cocheras: number;
  superficieConstruida: number;
  superficieTerreno: number;
  caracteristicas: string[];
  coordenadas: Coordenadas;
  imagenes: string[];
  destacada: boolean;
  destacadaHasta: string | null;
  fechaPublicacion: string;
  inmobiliaria: Inmobiliaria;
}

export type SortKey =
  | 'relevancia'
  | 'precio-asc'
  | 'precio-desc'
  | 'recientes'
  | 'superficie';

/**
 * The filter/sort shape shared by the results pages and the read API.
 * Path segments (operacion/tipo/lugar) and query params both resolve into this.
 */
export interface ListingQuery {
  operacion?: Operacion;
  /** One or more property types (chips are multi-select). */
  tipo?: Tipo[];
  /** Free-text match against barrio / ciudad / departamento. */
  ubicacion?: string;
  precioMinUSD?: number;
  precioMaxUSD?: number;
  dormitoriosMin?: number;
  banosMin?: number;
  superficieMin?: number;
  superficieMax?: number;
  caracteristicas?: string[];
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}
