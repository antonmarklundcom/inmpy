import Link from "next/link";
import type { Listing } from "@/lib/listings-schema";
import { formatDualPrice } from "@/lib/listings";
import { ImageWithFallback } from "./ImageWithFallback";

interface Props {
  title: string;
  listings: Listing[];
}

/** Horizontal scroll of numbered cards (clay 1–5 badge, image, overlay text). */
export function TopListRow({ title, listings }: Props) {
  if (listings.length === 0) return null;

  return (
    <section className="py-2">
      <h2 className="mb-4 font-serif text-xl font-semibold text-forest sm:text-2xl">
        {title}
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {listings.map((listing, i) => {
          const price = formatDualPrice(listing.precioUSD);
          return (
            <Link
              key={listing.id}
              href={`/propiedad/${listing.slug}`}
              className="group relative w-[260px] shrink-0 overflow-hidden rounded-card shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="relative aspect-[4/5] w-full">
                <ImageWithFallback
                  src={listing.imagenes[0]}
                  alt={listing.titulo}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-clay font-serif text-base font-semibold text-white shadow">
                  {i + 1}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-semibold">{price.usd}</p>
                  <h3 className="mt-0.5 line-clamp-1 font-serif text-sm font-medium">
                    {listing.titulo}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/80">
                    {listing.barrio ? `${listing.barrio}, ` : ""}
                    {listing.ciudad}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
