import { SITE_NAME, SITE_URL } from './config';
import { FX_PYG_USD } from './config';
import type { Listing } from './types';
import { TIPO_SINGULAR } from './taxonomy';

/** Absolute URL for a path. */
export function abs(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function breadcrumbJsonLd(
  crumbs: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function itemListJsonLd(listings: Listing[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(`/propiedad/${l.slug}`),
      name: l.titulo,
    })),
  };
}

/** schema.org Product + Offer for a single listing. */
export function listingJsonLd(listing: Listing): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.titulo,
    description: listing.descripcion,
    category: TIPO_SINGULAR[listing.tipo],
    image: listing.imagenes.map((img) => abs(`/images/${img}`)),
    url: abs(`/propiedad/${listing.slug}`),
    offers: {
      '@type': 'Offer',
      price: listing.precioUSD,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'RealEstateAgent',
        name: listing.inmobiliaria.nombre,
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Precio en Guaraníes',
        value: Math.round(listing.precioUSD * FX_PYG_USD),
        unitText: 'PYG',
      },
      {
        '@type': 'PropertyValue',
        name: 'Superficie construida',
        value: listing.superficieConstruida,
        unitText: 'MTK',
      },
      {
        '@type': 'PropertyValue',
        name: 'Superficie del terreno',
        value: listing.superficieTerreno,
        unitText: 'MTK',
      },
    ],
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  };
}
