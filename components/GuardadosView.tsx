"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Listing } from "@/lib/listings-schema";
import { useSavedListings } from "@/hooks/useSavedListings";
import { PropertyCard } from "./PropertyCard";

/**
 * Reads the saved slugs from localStorage and shows the matching listings.
 * Hydration-safe: renders nothing listing-specific until mounted, so server
 * and first client render agree.
 */
export function GuardadosView({ allListings }: { allListings: Listing[] }) {
  const { saved, hydrated } = useSavedListings();

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-muted">Cargando tus guardados…</div>
    );
  }

  const savedListings = allListings.filter((l) => saved.includes(l.slug));

  if (savedListings.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border bg-cream/50 px-6 py-20 text-center">
        <Heart className="mx-auto h-10 w-10 text-clay" aria-hidden />
        <p className="mt-4 font-serif text-xl text-forest">
          Todavía no guardaste ninguna propiedad
        </p>
        <p className="mt-2 text-muted">
          Tocá el corazón en cualquier propiedad para guardarla y verla acá.
        </p>
        <Link href="/comprar" className="btn-primary mx-auto mt-6">
          Explorar propiedades
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {savedListings.map((l) => (
        <PropertyCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
