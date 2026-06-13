import Link from "next/link";
import { Home } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className}`}
      aria-label="Vivienda Paraguay — inicio"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
        <Home className="h-5 w-5 text-primary" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl font-semibold text-forest">
          Vivienda
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
          Paraguay
        </span>
      </span>
    </Link>
  );
}
