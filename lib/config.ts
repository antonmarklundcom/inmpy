/**
 * Site-wide configuration constants.
 *
 * Everything degrades gracefully when the corresponding env vars are unset,
 * so a fresh clone runs with no `.env` file present.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Vivienda Paraguay';

/** Fallback WhatsApp contact used when a listing has no phone number. */
export const WHATSAPP_FALLBACK =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '595000000000';

/**
 * Fixed display conversion rate (1 USD ≈ this many Guaraníes).
 * Single source of truth for dual-price display across the app.
 */
export const FX_PYG_USD = Number(process.env.NEXT_PUBLIC_FX_PYG_USD ?? '7300') || 7300;

export const SITE_DESCRIPTION =
  'El lugar más tranquilo y agradable para buscar propiedades en venta y alquiler en Paraguay. Casas, departamentos, terrenos y más en Asunción y el Gran Asunción.';
