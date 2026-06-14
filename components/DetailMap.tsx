'use client';

import dynamic from 'next/dynamic';
import type { Listing } from '@/lib/types';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center rounded-card border border-line bg-cream text-sm text-muted">
      Cargando mapa…
    </div>
  ),
});

/** Single-location map for the listing detail page. */
export function DetailMap({ listing }: { listing: Listing }) {
  return <MapView listings={[listing]} heightClass="h-[360px]" />;
}
