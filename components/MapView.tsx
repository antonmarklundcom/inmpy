'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import type { Listing } from '@/lib/types';
import { formatDualPrice } from '@/lib/listings';
import { ImageWithFallback } from './ImageWithFallback';

/**
 * Clay teardrop pin built as an inline SVG divIcon — sidesteps Leaflet's
 * broken default-marker image paths under bundlers entirely.
 */
function clayPin(): L.DivIcon {
  const svg = `
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 25 15 25s15-15 15-25C30 6.7 23.3 0 15 0z"
        fill="#C25E3A"/>
      <circle cx="15" cy="15" r="6" fill="#fff"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: 'vivienda-pin',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -38],
  });
}

function FitBounds({ listings }: { listings: Listing[] }) {
  const map = useMap();
  useEffect(() => {
    if (listings.length === 0) return;
    const bounds = L.latLngBounds(
      listings.map((l) => [l.coordenadas.lat, l.coordenadas.lng] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [listings, map]);
  return null;
}

export default function MapView({
  listings,
  heightClass = 'h-[70vh] min-h-[400px]',
}: {
  listings: Listing[];
  heightClass?: string;
}) {
  const icon = useMemo(() => clayPin(), []);
  const center = useMemo<[number, number]>(() => {
    if (listings.length === 0) return [-25.28, -57.63];
    return [listings[0]!.coordenadas.lat, listings[0]!.coordenadas.lng];
  }, [listings]);

  return (
    <div className={`${heightClass} overflow-hidden rounded-card border border-line`}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
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
              icon={icon}
            >
              <Popup>
                <Link
                  href={`/propiedad/${l.slug}`}
                  className="block w-44 no-underline"
                >
                  <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-md bg-cream">
                    <ImageWithFallback
                      src={l.imagenes[0]}
                      alt={l.titulo}
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm font-bold text-primary">{price.usd}</p>
                  <p className="line-clamp-2 text-[0.8rem] font-semibold text-forest">
                    {l.titulo}
                  </p>
                  <p className="text-[0.7rem] text-muted">
                    {[l.barrio, l.ciudad].filter(Boolean).join(', ')}
                  </p>
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
