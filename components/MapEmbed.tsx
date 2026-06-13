"use client";

import dynamic from "next/dynamic";

// Client boundary so we can disable SSR for Leaflet (which needs window).
const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 w-full items-center justify-center rounded-card bg-cream text-muted">
      Cargando mapa…
    </div>
  ),
});

export function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  return <PropertyMap lat={lat} lng={lng} />;
}
