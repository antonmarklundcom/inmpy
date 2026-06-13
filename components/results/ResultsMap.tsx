"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Listing } from "@/lib/listings-schema";
import { formatDualPrice } from "@/lib/listings";
import { ImageWithFallback } from "@/components/ImageWithFallback";

/** Clay teardrop pin as an inline SVG divIcon (no external asset paths). */
const pinIcon = L.divIcon({
  className: "vivienda-pin",
  html: `<div style="transform:translate(-50%,-100%);">
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#C25E3A"/>
      <circle cx="15" cy="15" r="6" fill="#ffffff"/>
    </svg>
  </div>`,
  iconSize: [30, 40],
  iconAnchor: [0, 0],
});

function FitBounds({ listings }: { listings: Listing[] }) {
  const map = useMap();
  useEffect(() => {
    if (listings.length === 0) return;
    const bounds = L.latLngBounds(
      listings.map((l) => [l.coordenadas.lat, l.coordenadas.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [listings, map]);
  return null;
}

export default function ResultsMap({ listings }: { listings: Listing[] }) {
  const center: [number, number] =
    listings.length > 0
      ? [listings[0]!.coordenadas.lat, listings[0]!.coordenadas.lng]
      : [-25.2867, -57.3333];

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      className="h-[60vh] min-h-[420px] w-full rounded-card"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds listings={listings} />
      {listings.map((l) => {
        const price = formatDualPrice(l.precioUSD);
        return (
          <Marker
            key={l.id}
            position={[l.coordenadas.lat, l.coordenadas.lng]}
            icon={pinIcon}
          >
            <Popup>
              <Link href={`/propiedad/${l.slug}`} className="block w-48">
                <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-cream">
                  <ImageWithFallback
                    src={l.imagenes[0]}
                    alt={l.titulo}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                </span>
                <span className="mt-1.5 block font-semibold text-forest">
                  {price.usd}
                </span>
                <span className="block text-xs text-muted">{price.gs}</span>
                <span className="mt-0.5 block text-sm font-medium text-text">
                  {l.titulo}
                </span>
                <span className="block text-xs text-muted">
                  {l.barrio ? `${l.barrio}, ` : ""}
                  {l.ciudad}
                </span>
              </Link>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
