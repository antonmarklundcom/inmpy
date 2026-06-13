import Link from "next/link";
import { Bath, BedDouble, Car, MapPin, Maximize } from "lucide-react";
import type { Listing } from "@/lib/listings-schema";
import { formatDualPrice, isFeatured, TIPO_LABEL } from "@/lib/listings";
import { ImageWithFallback } from "./ImageWithFallback";
import { SaveButton } from "./SaveButton";

interface Props {
  listing: Listing;
  priority?: boolean;
}

export function PropertyCard({ listing, priority = false }: Props) {
  const price = formatDualPrice(listing.precioUSD);
  const featured = isFeatured(listing);
  const area = listing.superficieConstruida || listing.superficieTerreno;
  const isTerreno = listing.tipo === "terreno";
  const operacionLabel = listing.operacion === "venta" ? "Venta" : "Alquiler";

  return (
    <article className="group overflow-hidden rounded-card bg-white shadow-soft transition-shadow hover:shadow-card">
      <Link href={`/propiedad/${listing.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
          <ImageWithFallback
            src={listing.imagenes[0]}
            alt={listing.titulo}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-text shadow-soft">
              {operacionLabel}
            </span>
            {featured && <span className="badge-destacada">Destacada</span>}
          </div>
          <div className="absolute right-3 top-3">
            <SaveButton slug={listing.slug} />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/propiedad/${listing.slug}`}>
          <p className="text-lg font-semibold text-forest">{price.usd}</p>
          <p className="text-sm text-muted">{price.gs}</p>

          <h3 className="mt-2 line-clamp-1 font-serif text-base font-medium text-text">
            {listing.titulo}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-1">
              {listing.barrio ? `${listing.barrio}, ` : ""}
              {listing.ciudad}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-sm text-muted">
            <span className="inline-flex items-center gap-1 rounded bg-cream/60 px-1.5 py-0.5 text-xs font-medium text-primary">
              {TIPO_LABEL[listing.tipo].singular}
            </span>
            {!isTerreno && (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4" aria-hidden />
                  {listing.dormitorios}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Bath className="h-4 w-4" aria-hidden />
                  {listing.banos}
                </span>
              </>
            )}
            {listing.cocheras > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Car className="h-4 w-4" aria-hidden />
                {listing.cocheras}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="h-4 w-4" aria-hidden />
              {area} m²
            </span>
          </div>
        </Link>
      </div>
    </article>
  );
}
