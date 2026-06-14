import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  BedDouble,
  Bath,
  Maximize,
  LandPlot,
  Car,
  MapPin,
  Check,
  CalendarDays,
} from 'lucide-react';
import { getAllListings, getListingBySlug } from '@/lib/listings-repo';
import { formatDualPrice, formatArea, similarListings } from '@/lib/listings';
import { TIPO_SINGULAR, OPERACION_VERBO, OPERACION_TO_SLUG, TIPO_TO_SLUG } from '@/lib/taxonomy';
import { breadcrumbJsonLd, listingJsonLd } from '@/lib/seo';
import { SITE_NAME } from '@/lib/config';
import { Gallery } from '@/components/Gallery';
import { AgentContactCard } from '@/components/AgentContactCard';
import { DetailMap } from '@/components/DetailMap';
import { PropertyCard } from '@/components/PropertyCard';
import { SaveHeart } from '@/components/SaveHeart';
import { JsonLd } from '@/components/JsonLd';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const all = await getAllListings();
  return all.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug);
  if (!listing) return {};
  const price = formatDualPrice(listing.precioUSD);
  const title = `${listing.titulo} · ${price.usd}`;
  const description = listing.descripcion.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/propiedad/${listing.slug}` },
    openGraph: {
      title: `${listing.titulo} · ${SITE_NAME}`,
      description,
      type: 'website',
      images: listing.imagenes[0]
        ? [{ url: `/images/${listing.imagenes[0]}` }]
        : undefined,
    },
  };
}

const dateFmt = new Intl.DateTimeFormat('es-PY', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default async function PropiedadPage({ params }: { params: Params }) {
  const listing = await getListingBySlug(params.slug);
  if (!listing) notFound();

  const all = await getAllListings();
  const similares = similarListings(all, listing);
  const price = formatDualPrice(listing.precioUSD);
  const isTerreno = listing.tipo === 'terreno';
  const ubicacion = [listing.barrio, listing.ciudad, listing.departamento]
    .filter(Boolean)
    .join(', ');

  const crumbs = [
    { name: 'Inicio', path: '/' },
    {
      name: listing.operacion === 'venta' ? 'Comprar' : 'Alquilar',
      path: `/${OPERACION_TO_SLUG[listing.operacion]}`,
    },
    {
      name: `${TIPO_SINGULAR[listing.tipo]}s`,
      path: `/${OPERACION_TO_SLUG[listing.operacion]}/${TIPO_TO_SLUG[listing.tipo]}`,
    },
    { name: listing.titulo, path: `/propiedad/${listing.slug}` },
  ];

  const facts = [
    !isTerreno && { Icon: BedDouble, label: 'Dormitorios', value: listing.dormitorios },
    !isTerreno && { Icon: Bath, label: 'Baños', value: listing.banos },
    !isTerreno &&
      listing.superficieConstruida > 0 && {
        Icon: Maximize,
        label: 'Construidos',
        value: formatArea(listing.superficieConstruida),
      },
    listing.superficieTerreno > 0 && {
      Icon: LandPlot,
      label: 'Terreno',
      value: formatArea(listing.superficieTerreno),
    },
    listing.cocheras > 0 && { Icon: Car, label: 'Cocheras', value: listing.cocheras },
  ].filter(Boolean) as { Icon: typeof BedDouble; label: string; value: string | number }[];

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), listingJsonLd(listing)]} />

      <div className="container-content py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-muted" aria-label="Migas de pan">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.slice(0, -1).map((c) => (
              <li key={c.path} className="flex items-center gap-1.5">
                <Link href={c.path} className="hover:text-primary">
                  {c.name}
                </Link>
                <span aria-hidden>/</span>
              </li>
            ))}
            <li className="line-clamp-1 text-ink">{listing.titulo}</li>
          </ol>
        </nav>

        {/* Gallery */}
        <Gallery images={listing.imagenes} title={listing.titulo} />

        <div className="mt-8 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* Main column */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {TIPO_SINGULAR[listing.tipo]} {OPERACION_VERBO[listing.operacion]}
                </span>
                <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
                  {listing.titulo}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-muted">
                  <MapPin className="h-4 w-4" />
                  {ubicacion}
                </p>
              </div>
              <SaveHeart id={listing.id} variant="inline" className="shrink-0" />
            </div>

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-line py-5">
              <span className="text-3xl font-bold text-primary">
                {price.usd}
                {listing.operacion === 'alquiler' && (
                  <span className="text-base font-medium text-muted"> / mes</span>
                )}
              </span>
              <span className="text-lg font-medium text-muted">{price.gs}</span>
            </div>

            {/* Key facts */}
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {facts.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center gap-3 rounded-card bg-cream p-4"
                >
                  <f.Icon className="h-6 w-6 text-primary" />
                  <span>
                    <span className="block text-lg font-semibold text-ink">
                      {f.value}
                    </span>
                    <span className="block text-xs text-muted">{f.label}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Description */}
            <section className="mt-8">
              <h2 className="section-title mb-3 text-2xl">Descripción</h2>
              <p className="whitespace-pre-line leading-relaxed text-ink/90">
                {listing.descripcion}
              </p>
            </section>

            {/* Características */}
            {listing.caracteristicas.length > 0 && (
              <section className="mt-8">
                <h2 className="section-title mb-3 text-2xl">Características</h2>
                <ul className="flex flex-wrap gap-2">
                  {listing.caracteristicas.map((c) => (
                    <li
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-sm text-ink"
                    >
                      <Check className="h-4 w-4 text-primary" />
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Map */}
            <section className="mt-8">
              <h2 className="section-title mb-3 text-2xl">Ubicación</h2>
              <DetailMap listing={listing} />
            </section>

            {/* Dates */}
            <p className="mt-6 flex items-center gap-1.5 text-sm text-muted">
              <CalendarDays className="h-4 w-4" />
              Publicado el {dateFmt.format(new Date(listing.fechaPublicacion))}
            </p>
          </div>

          {/* Sidebar */}
          <aside className="mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-32">
              <AgentContactCard listing={listing} />
            </div>
          </aside>
        </div>

        {/* Similar */}
        {similares.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title mb-5">Propiedades similares</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similares.map((l) => (
                <PropertyCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
