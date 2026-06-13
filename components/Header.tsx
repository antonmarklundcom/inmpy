"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Plus } from "lucide-react";
import { Logo } from "./Logo";
import { useSavedListings } from "@/hooks/useSavedListings";

const NAV = [
  { href: "/comprar", label: "Comprar" },
  { href: "/alquilar", label: "Alquilar" },
];

export function Header() {
  const pathname = usePathname();
  const { count, hydrated } = useSavedListings();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Principal">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm font-medium text-text transition-colors hover:text-primary"
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/guardados"
            className="relative flex items-center gap-1.5 rounded-control px-2.5 py-2 text-sm text-text transition-colors hover:text-clay"
            aria-label="Propiedades guardadas"
          >
            <Heart className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">Guardados</span>
            {hydrated && count > 0 && (
              <span className="absolute -right-1 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-clay px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-control bg-clay px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Publicar
          </Link>

          <button
            type="button"
            className="hidden text-sm text-muted transition-colors hover:text-text md:inline"
            aria-disabled="true"
            title="Disponible próximamente"
          >
            Ingresar
          </button>
        </div>
      </div>
    </header>
  );
}
