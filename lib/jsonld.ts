/**
 * schema.org JSON-LD builders. Pure functions returning plain objects that the
 * <JsonLd> component serializes into a <script type="application/ld+json">.
 */

import type { Listing } from "./listings-schema";
import { SITE_NAME, SITE_URL } from "./config";
import {
  TIPO_LABEL,
  TIPO_PLURAL,
  operacionToRouteBase,
  slugify,
} from "./listings";

export function listingJsonLd(listing: Listing) {
  const url = `${SITE_URL}/propiedad/${listing.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.titulo,
    description: listing.descripcion,
    url,
    image: listing.imagenes.map((img) => `${SITE_URL}/images/${img}`),
    category: TIPO_LABEL[listing.tipo].singular,
    offers: {
      "@type": "Offer",
      price: listing.precioUSD,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      seller: {
        "@type": "RealEstateAgent",
        name: listing.inmobiliaria.nombre,
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Dormitorios",
        value: listing.dormitorios,
      },
      { "@type": "PropertyValue", name: "Baños", value: listing.banos },
      {
        "@type": "PropertyValue",
        name: "Superficie construida (m²)",
        value: listing.superficieConstruida,
      },
      {
        "@type": "PropertyValue",
        name: "Superficie terreno (m²)",
        value: listing.superficieTerreno,
      },
    ],
  };
}

export function listingBreadcrumb(listing: Listing) {
  const base = operacionToRouteBase(listing.operacion);
  const tipoPlural = TIPO_PLURAL[listing.tipo];
  const opLabel = listing.operacion === "venta" ? "Comprar" : "Alquilar";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: opLabel,
        item: `${SITE_URL}/${base}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: TIPO_LABEL[listing.tipo].plural,
        item: `${SITE_URL}/${base}/${tipoPlural}`,
      },
      { "@type": "ListItem", position: 4, name: listing.titulo, item: `${SITE_URL}/propiedad/${listing.slug}` },
    ],
  };
}

export function landingItemList(listings: Listing[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: pageUrl,
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/propiedad/${l.slug}`,
      name: l.titulo,
    })),
  };
}

export function landingBreadcrumb(params: {
  operacionBase: string;
  opLabel: string;
  tipoPlural: string;
  tipoLabel: string;
  lugarLabel?: string;
  lugarSlug?: string;
}) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: params.opLabel,
      item: `${SITE_URL}/${params.operacionBase}`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: params.tipoLabel,
      item: `${SITE_URL}/${params.operacionBase}/${params.tipoPlural}`,
    },
  ];
  if (params.lugarLabel && params.lugarSlug) {
    items.push({
      "@type": "ListItem",
      position: 4,
      name: params.lugarLabel,
      item: `${SITE_URL}/${params.operacionBase}/${params.tipoPlural}/${params.lugarSlug}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

// Re-export to keep slugify reachable for callers building lugar slugs.
export { slugify };
