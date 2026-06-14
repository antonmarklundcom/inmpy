import type { MetadataRoute } from 'next';
import { getAllListings, getStaticLandingParams } from '@/lib/listings-repo';
import { SITE_URL } from '@/lib/config';

/**
 * Sitemap generated from the data: home, the two operación roots, every valid
 * landing-page combo (only those with >=1 listing), and every listing detail.
 * Empty combos are omitted, so they are noindex by omission.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getAllListings();
  const combos = await getStaticLandingParams();

  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/comprar`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/alquilar`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ];

  for (const c of combos) {
    const path = [c.operacion, c.tipo, c.lugar].filter(Boolean).join('/');
    entries.push({
      url: `${SITE_URL}/${path}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: c.lugar ? 0.7 : 0.8,
    });
  }

  for (const l of listings) {
    entries.push({
      url: `${SITE_URL}/propiedad/${l.slug}`,
      lastModified: new Date(l.fechaPublicacion),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return entries;
}
