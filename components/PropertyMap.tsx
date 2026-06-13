"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

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

export default function PropertyMap({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-72 w-full rounded-card"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={pinIcon} />
    </MapContainer>
  );
}
