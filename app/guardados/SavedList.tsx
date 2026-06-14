'use client';

import Link from 'next/link';
import { HeartCrack } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { useSavedIds, useMounted } from '@/lib/saved';
import { PropertyCard } from '@/components/PropertyCard';

export function SavedList({ listings }: { listings: Listing[] }) {
  const mounted = useMounted();
  const ids = useSavedIds();

  // Render nothing meaningful until mounted to stay hydration-safe.
  if (!mounted) {
    return <div className="mt-8 h-40" aria-hidden />;
  }

  const saved = listings.filter((l) => ids.includes(l.id));

  if (saved.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-cream py-20 text-center">
        <HeartCrack className="h-8 w-8 text-muted" />
        <p className="font-serif text-xl font-semibold text-forest">
          Todavía no guardaste propiedades
        </p>
        <p className="max-w-sm text-sm text-muted">
          Tocá el corazón en cualquier propiedad para guardarla y encontrarla
          fácil acá.
        </p>
        <Link href="/comprar" className="btn-primary mt-2">
          Explorar propiedades
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-4 text-sm text-muted">
        {saved.length} {saved.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((l) => (
          <PropertyCard key={l.id} listing={l} />
        ))}
      </div>
    </>
  );
}
