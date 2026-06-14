import Link from 'next/link';
import { MapPin } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { formatDualPrice, isFeatured } from '@/lib/listings';
import { TIPO_SINGULAR, OPERACION_VERBO } from '@/lib/taxonomy';
import { ImageWithFallback } from './ImageWithFallback';
import { SaveHeart } from './SaveHeart';
import { MetaRow } from './MetaRow';

interface Props {
  listing: Listing;
  priority?: boolean;
}

export function PropertyCard({ listing, priority }: Props) {
  const price = formatDualPrice(listing.precioUSD);
  const featured = isFeatured(listing);
  const href = `/propiedad/${listing.slug}`;
  const ubicacion = [listing.barrio, listing.ciudad].filter(Boolean).join(', ');

  return (
    <article className="card group overflow-hidden transition-shadow hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <Link href={href} aria-label={listing.titulo}>
          <ImageWithFallback
            src={listing.imagenes[0]}
            alt={listing.titulo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority={priority}
          />
        </Link>

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-forest/85 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {TIPO_SINGULAR[listing.tipo]} {OPERACION_VERBO[listing.operacion]}
          </span>
          {featured && (
            <span className="rounded-full bg-clay px-2.5 py-1 text-xs font-semibold text-white">
              Destacada
            </span>
          )}
        </div>

        <SaveHeart id={listing.id} className="absolute right-3 top-3" />
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-lg font-bold text-primary">{price.usd}</p>
          {listing.operacion === 'alquiler' && (
            <span className="text-xs font-medium text-muted">/ mes</span>
          )}
        </div>
        <p className="text-sm font-medium text-muted">{price.gs}</p>

        <h3 className="line-clamp-1 font-serif text-lg font-semibold text-forest">
          <Link href={href} className="hover:underline">
            {listing.titulo}
          </Link>
        </h3>

        <p className="flex items-center gap-1 text-sm text-muted">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{ubicacion}</span>
        </p>

        <div className="border-t border-line pt-3">
          <MetaRow listing={listing} />
        </div>
      </div>
    </article>
  );
}
