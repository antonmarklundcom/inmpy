/**
 * Central, runtime-safe configuration. The site must build and run with every
 * NEXT_PUBLIC_* var unset — every value below has a sensible default.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME || "Vivienda Paraguay";

/** Fallback WhatsApp number used when a listing carries no agency phone. */
export const WHATSAPP_FALLBACK =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "595000000000";

/** Fixed display conversion rate: 1 USD ≈ X Gs. Single source of truth. */
export const FX_PYG_USD = Number(process.env.NEXT_PUBLIC_FX_PYG_USD) || 7300;

export const LOCALE = "es-PY";
