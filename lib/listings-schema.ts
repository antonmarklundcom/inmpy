import { z } from 'zod';

/**
 * Zod schema for a single seed listing. The repository validates the seed
 * array against this at load time, so a malformed seed entry fails loudly
 * instead of silently rendering broken cards.
 */

export const operacionSchema = z.enum(['venta', 'alquiler']);

export const tipoSchema = z.enum([
  'casa',
  'departamento',
  'duplex',
  'terreno',
  'oficina',
  'local',
]);

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
  coordenadas: z.object({ lat: z.number(), lng: z.number() }),
  imagenes: z.array(z.string()),
  destacada: z.boolean(),
  destacadaHasta: z.string().nullable(),
  fechaPublicacion: z.string(),
  inmobiliaria: z.object({
    nombre: z.string().min(1),
    telefono: z.string().min(1),
  }),
});

export const listingsSchema = z.array(listingSchema);

/**
 * Query-param schema for the read API. Coerces string query params into the
 * typed `ListingQuery` shape and rejects garbage.
 */
export const listingQuerySchema = z.object({
  operacion: operacionSchema.optional(),
  tipo: z.array(tipoSchema).optional(),
  ubicacion: z.string().optional(),
  precioMinUSD: z.coerce.number().nonnegative().optional(),
  precioMaxUSD: z.coerce.number().nonnegative().optional(),
  dormitoriosMin: z.coerce.number().int().nonnegative().optional(),
  banosMin: z.coerce.number().int().nonnegative().optional(),
  superficieMin: z.coerce.number().nonnegative().optional(),
  superficieMax: z.coerce.number().nonnegative().optional(),
  caracteristicas: z.array(z.string()).optional(),
  sort: z
    .enum(['relevancia', 'precio-asc', 'precio-desc', 'recientes', 'superficie'])
    .optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

export type ListingSeed = z.infer<typeof listingSchema>;
