import Link from 'next/link';
import { Home } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 ${className ?? ''}`}
      aria-label="Vivienda Paraguay — inicio"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary/10 text-primary">
        <Home className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="leading-none">
        <span className="block font-serif text-xl font-semibold text-forest">
          Vivienda
        </span>
        <span className="block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted">
          Paraguay
        </span>
      </span>
    </Link>
  );
}
