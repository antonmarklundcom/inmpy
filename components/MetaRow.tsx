import { BedDouble, Bath, Maximize, Car } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { formatArea } from '@/lib/listings';

/** Compact icon meta row used on cards. Hides bed/bath for terreno. */
export function MetaRow({ listing }: { listing: Listing }) {
  const isTerreno = listing.tipo === 'terreno';
  const area = listing.superficieConstruida || listing.superficieTerreno;
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
      {!isTerreno && (
        <li className="flex items-center gap-1.5">
          <BedDouble className="h-4 w-4" />
          <span>{listing.dormitorios}</span>
        </li>
      )}
      {!isTerreno && (
        <li className="flex items-center gap-1.5">
          <Bath className="h-4 w-4" />
          <span>{listing.banos}</span>
        </li>
      )}
      <li className="flex items-center gap-1.5">
        <Maximize className="h-4 w-4" />
        <span>{formatArea(area)}</span>
      </li>
      {listing.cocheras > 0 && (
        <li className="flex items-center gap-1.5">
          <Car className="h-4 w-4" />
          <span>{listing.cocheras}</span>
        </li>
      )}
    </ul>
  );
}
