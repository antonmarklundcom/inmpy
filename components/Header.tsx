'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Logo } from './Logo';
import { useSavedCount } from '@/lib/saved';

const nav = [
  { href: '/comprar', label: 'Comprar' },
  { href: '/alquilar', label: 'Alquilar' },
];

export function Header() {
  const pathname = usePathname();
  const savedCount = useSavedCount();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-7 sm:flex" aria-label="Principal">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  active ? 'text-primary' : 'text-ink hover:text-primary'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-[2px] left-0 right-0 h-0.5 rounded bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/guardados"
            className="relative flex items-center gap-1.5 rounded-control px-2.5 py-2 text-sm font-medium text-ink hover:text-primary"
            aria-label="Propiedades guardadas"
          >
            <Heart className="h-5 w-5" />
            <span className="hidden sm:inline">Guardados</span>
            {savedCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[0.65rem] font-bold text-white">
                {savedCount}
              </span>
            )}
          </Link>

          <span className="hidden text-sm font-medium text-muted hover:text-ink sm:inline">
            <Link href="#" aria-disabled className="cursor-default">
              Ingresar
            </Link>
          </span>

          <Link href="/" className="btn-clay px-3.5 py-2 text-sm sm:px-5">
            Publicar
          </Link>
        </div>
      </div>

      {/* Mobile nav row */}
      <nav
        className="flex items-center gap-6 border-t border-line px-4 py-2 sm:hidden"
        aria-label="Principal móvil"
      >
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium ${
                active ? 'text-primary' : 'text-ink'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
