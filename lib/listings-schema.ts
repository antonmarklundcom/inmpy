import { z } from "zod";

/**
 * The canonical Listing schema. The seed array is validated against this at
 * load time inside lib/listings-repo.ts, so Phase 2's database rows can be
 * validated through the exact same contract.
 */

export const operacionSchema = z.enum(["venta", "alquiler"]);
export type Operacion = z.infer<typeof operacionSchema>;

export const tipoSchema = z.enum([
  "casa",
  "departamento",
  "duplex",
  "terreno",
  "oficina",
  "local",
]);
export type Tipo = z.infer<typeof tipoSchema>;

export const inmobiliariaSchema = z.object({
  nombre: z.string().min(1),
  telefono: z.string().min(1), // 595... format for wa.me
});

export const coordenadasSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const listingSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  operacion: operacionSchema,
  tipo: tipoSchema,
  titulo: z.string().min(1),
  descripcion: z.string().min(1),
  precioUSD: z.number().nonnegative(),
  precioGs: z.number().nonnegative(),
  barrio: z.string(),
  ciudad: z.string().min(1),
  departamento: z.string().min(1),
  dormitorios: z.number().int().nonnegative(),
  banos: z.number().int().nonnegative(),
  cocheras: z.number().int().nonnegative(),
  superficieConstruida: z.number().nonnegative(),
  superficieTerreno: z.number().nonnegative(),
  caracteristicas: z.array(z.string()),
  coordenadas: coordenadasSchema,
  imagenes: z.array(z.string()),
  destacada: z.boolean(),
  destacadaHasta: z.string().nullable(),
  fechaPublicacion: z.string(),
  inmobiliaria: inmobiliariaSchema,
});

export type Listing = z.infer<typeof listingSchema>;

export const listingsSchema = z.array(listingSchema);

/** Sort options exposed in the results UI. */
export const sortSchema = z.enum([
  "relevancia",
  "precio-asc",
  "precio-desc",
  "recientes",
  "superficie",
]);
export type Sort = z.infer<typeof sortSchema>;

/**
 * Query contract shared by the results pages, the read API, and the repo.
 * All optional so the bare /comprar and /alquilar roots work with any subset.
 */
export const listingQuerySchema = z.object({
  operacion: operacionSchema.optional(),
  tipo: z.array(tipoSchema).optional(),
  lugar: z.string().optional(), // free-text match on barrio/ciudad/departamento
  precioMin: z.number().nonnegative().optional(),
  precioMax: z.number().nonnegative().optional(),
  dormitorios: z.number().int().nonnegative().optional(), // N+ minimum
  banos: z.number().int().nonnegative().optional(), // N+ minimum
  superficieMin: z.number().nonnegative().optional(),
  superficieMax: z.number().nonnegative().optional(),
  caracteristicas: z.array(z.string()).optional(),
  sort: sortSchema.optional(),
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().max(100).optional(),
});

export type ListingQuery = z.infer<typeof listingQuerySchema>;
