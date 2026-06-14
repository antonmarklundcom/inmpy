import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { formatDualPrice } from '@/lib/listings';
import { ImageWithFallback } from './ImageWithFallback';

interface Props {
  title: string;
  listings: Listing[];
}

/**
 * Horizontal scroll rail of numbered cards (clay 1–5 badge, image, overlay
 * text). Used on the home page for "top lists" computed from the data.
 */
export function TopListRow({ title, listings }: Props) {
  if (listings.length === 0) return null;
  return (
    <section>
      <h2 className="section-title mb-4">{title}</h2>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {listings.map((listing, i) => {
          const price = formatDualPrice(listing.precioUSD);
          return (
            <Link
              key={listing.id}
              href={`/propiedad/${listing.slug}`}
              className="group relative aspect-[3/4] w-56 shrink-0 snap-start overflow-hidden rounded-card bg-cream shadow-card sm:w-64"
            >
              <ImageWithFallback
                src={listing.imagenes[0]}
                alt={listing.titulo}
                fill
                sizes="256px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-clay text-sm font-bold text-white shadow">
                {i + 1}
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent p-3 pt-10 text-white">
                <p className="text-sm font-bold">{price.usd}</p>
                <p className="line-clamp-1 font-serif text-base font-semibold">
                  {listing.titulo}
                </p>
                <p className="line-clamp-1 text-xs text-white/80">
                  {[listing.barrio, listing.ciudad].filter(Boolean).join(', ')}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
