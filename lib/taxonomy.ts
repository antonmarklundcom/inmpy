import type { Operacion, Tipo } from './types';

/**
 * Display labels and URL slug mappings for property types and operations.
 * Shared by the UI, the routing layer, and SEO copy generation.
 */

export const TIPO_SINGULAR: Record<Tipo, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  duplex: 'Dúplex',
  terreno: 'Terreno',
  oficina: 'Oficina',
  local: 'Local',
};

export const TIPO_PLURAL: Record<Tipo, string> = {
  casa: 'Casas',
  departamento: 'Departamentos',
  duplex: 'Dúplex',
  terreno: 'Terrenos',
  oficina: 'Oficinas',
  local: 'Locales',
};

/** URL segment ↔ tipo. The `[tipo]` path segment uses plural slugs. */
export const TIPO_TO_SLUG: Record<Tipo, string> = {
  casa: 'casas',
  departamento: 'departamentos',
  duplex: 'duplex',
  terreno: 'terrenos',
  oficina: 'oficinas',
  local: 'locales',
};

export const SLUG_TO_TIPO: Record<string, Tipo> = Object.entries(
  TIPO_TO_SLUG,
).reduce<Record<string, Tipo>>((acc, [tipo, slug]) => {
  acc[slug] = tipo as Tipo;
  return acc;
}, {});

export const TIPOS: Tipo[] = [
  'casa',
  'departamento',
  'duplex',
  'terreno',
  'oficina',
  'local',
];

export const OPERACION_TO_SLUG: Record<Operacion, string> = {
  venta: 'comprar',
  alquiler: 'alquilar',
};

export const SLUG_TO_OPERACION: Record<string, Operacion> = {
  comprar: 'venta',
  alquilar: 'alquiler',
};

export const OPERACION_VERBO: Record<Operacion, string> = {
  venta: 'en venta',
  alquiler: 'en alquiler',
};

export function tipoFromSlug(slug: string): Tipo | null {
  return SLUG_TO_TIPO[slug] ?? null;
}

export function operacionFromSlug(slug: string): Operacion | null {
  return SLUG_TO_OPERACION[slug] ?? null;
}
