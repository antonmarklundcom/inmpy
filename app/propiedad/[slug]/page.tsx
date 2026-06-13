import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Calendar,
  Car,
  Check,
  ChevronRight,
  Maximize,
  Ruler,
} from "lucide-react";
import { getAllListings, getListingBySlug } from "@/lib/listings-repo";
import {
  formatArea,
  formatDate,
  formatDualPrice,
  getSimilarListings,
  isFeatured,
  operacionToRouteBase,
  TIPO_LABEL,
  TIPO_PLURAL,
} from "@/lib/listings";
import {
  listingBreadcrumb,
  listingJsonLd,
} from "@/lib/jsonld";
import { Gallery } from "@/components/gallery/Gallery";
import { AgentContactCard } from "@/components/AgentContactCard";
import { MapEmbed } from "@/components/MapEmbed";
import { PropertyCard } from "@/components/PropertyCard";
import { SaveButton } from "@/components/SaveButton";
import { JsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  const listings = await getAllListings();
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Propiedad no encontrada" };

  const price = formatDualPrice(listing.precioUSD);
  const title = `${listing.titulo} — ${price.usd}`;
  const description = listing.descripcion.slice(0, 160);
  const ogImage = listing.imagenes[0]
    ? `/images/${listing.imagenes[0]}`
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/propiedad/${listing.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function PropiedadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const all = await getAllListings();
  const similar = getSimilarListings(all, listing);
  const price = formatDualPrice(listing.precioUSD);
  const base = operacionToRouteBase(listing.operacion);
  const tipoPlural = TIPO_PLURAL[listing.tipo];
  const opLabel = listing.operacion === "venta" ? "Comprar" : "Alquilar";
  const isTerreno = listing.tipo === "terreno";
  const featured = isFeatured(listing);

  const facts = [
    !isTerreno && {
      Icon: BedDouble,
      label: "Dormitorios",
      value: listing.dormitorios,
    },
    !isTerreno && { Icon: Bath, label: "Baños", value: listing.banos },
    !isTerreno &&
      listing.superficieConstruida > 0 && {
        Icon: Maximize,
        label: "Construidos",
        value: formatArea(listing.superficieConstruida),
      },
    listing.superficieTerreno > 0 && {
      Icon: Ruler,
      label: "Terreno",
      value: formatArea(listing.superficieTerreno),
    },
    listing.cocheras > 0 && {
      Icon: Car,
      label: "Cocheras",
      value: listing.cocheras,
    },
  ].filter(Boolean) as { Icon: typeof BedDouble; label: string; value: string | number }[];

  return (
    <article className="container-page py-6 sm:py-8">
      <JsonLd data={[listingJsonLd(listing), listingBreadcrumb(listing)]} />

      {/* Breadcrumb */}
      <nav
        aria-label="Migas de pan"
        className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted"
      >
        <Link href="/" className="hover:text-primary">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href={`/${base}`} className="hover:text-primary">
          {opLabel}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href={`/${base}/${tipoPlural}`} className="hover:text-primary">
          {TIPO_LABEL[listing.tipo].plural}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="line-clamp-1 text-text">{listing.titulo}</span>
      </nav>

      {/* Gallery */}
      <Gallery images={listing.imagenes} title={listing.titulo} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {opLabel === "Comprar" ? "En venta" : "En alquiler"}
                </span>
                <span className="inline-flex items-center rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-text">
                  {TIPO_LABEL[listing.tipo].singular}
                </span>
                {featured && <span className="badge-destacada">Destacada</span>}
              </div>
              <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">
                {listing.titulo}
              </h1>
              <p className="mt-1 text-muted">
                {listing.barrio ? `${listing.barrio}, ` : ""}
                {listing.ciudad}, {listing.departamento}
              </p>
            </div>
            <SaveButton slug={listing.slug} size="lg" />
          </div>

          {/* Price */}
          <div className="mt-4 border-y border-border py-4">
            <p className="text-2xl font-semibold text-forest sm:text-3xl">
              {price.usd}
              {listing.operacion === "alquiler" && (
                <span className="text-base font-normal text-muted"> /mes</span>
              )}
            </p>
            <p className="text-muted">{price.gs}</p>
          </div>

          {/* Key facts */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map((f) => (
              <div
                key={f.label}
                className="rounded-card border border-border bg-white p-4 text-center"
              >
                <f.Icon className="mx-auto h-5 w-5 text-primary" aria-hidden />
                <p className="mt-1.5 font-semibold text-text">{f.value}</p>
                <p className="text-xs text-muted">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <section className="mt-8">
            <h2 className="mb-2 font-serif text-xl font-semibold text-forest">
              Descripción
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-text/90">
              {listing.descripcion}
            </p>
          </section>

          {/* Características */}
          {listing.caracteristicas.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 font-serif text-xl font-semibold text-forest">
                Características
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {listing.caracteristicas.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-text/90">
                    <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Map */}
          <section className="mt-8">
            <h2 className="mb-3 font-serif text-xl font-semibold text-forest">
              Ubicación
            </h2>
            <MapEmbed lat={listing.coordenadas.lat} lng={listing.coordenadas.lng} />
          </section>

          {/* Dates */}
          <p className="mt-6 flex items-center gap-1.5 text-sm text-muted">
            <Calendar className="h-4 w-4" aria-hidden />
            Publicado el {formatDate(listing.fechaPublicacion)}
          </p>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <AgentContactCard
            inmobiliaria={listing.inmobiliaria}
            titulo={listing.titulo}
            slug={listing.slug}
          />
        </aside>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-serif text-2xl font-semibold text-forest">
            Propiedades similares
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
