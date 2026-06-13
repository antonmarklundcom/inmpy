import type { MetadataRoute } from "next";
import { getAllListings, getStaticLandingParams } from "@/lib/listings-repo";
import { SITE_URL } from "@/lib/config";

/**
 * Generated from the data: home, the two results roots, every listing detail
 * page, and every valid landing-page combo (tipo and tipo/lugar). Empty combos
 * are omitted by getStaticLandingParams, so they stay out of the index.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getAllListings();
  const combos = await getStaticLandingParams();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/comprar`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/alquilar`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  const landingRoutes: MetadataRoute.Sitemap = combos.map((c) => ({
    url: c.lugar
      ? `${SITE_URL}/${c.operacion}/${c.tipo}/${c.lugar}`
      : `${SITE_URL}/${c.operacion}/${c.tipo}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: c.lugar ? 0.7 : 0.8,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${SITE_URL}/propiedad/${l.slug}`,
    lastModified: new Date(l.fechaPublicacion),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...landingRoutes, ...listingRoutes];
}
