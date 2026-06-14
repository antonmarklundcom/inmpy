import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-content flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Home className="h-8 w-8" strokeWidth={2} />
      </span>
      <p className="font-serif text-5xl font-semibold text-forest">404</p>
      <h1 className="mt-3 font-serif text-2xl font-semibold text-forest">
        No encontramos esta página
      </h1>
      <p className="mt-2 max-w-md text-muted">
        Es posible que la propiedad ya no esté disponible o que el enlace sea
        incorrecto. Probá buscar entre las propiedades disponibles.
      </p>

      <form
        action="/comprar"
        method="get"
        className="mt-6 flex w-full max-w-md items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            name="ubicacion"
            placeholder="Barrio, ciudad o departamento"
            className="input pl-11"
            aria-label="Buscar propiedades"
          />
        </div>
        <button type="submit" className="btn-primary">
          Buscar
        </button>
      </form>

      <div className="mt-6 flex gap-4 text-sm font-semibold text-primary">
        <Link href="/" className="hover:underline">
          Volver al inicio
        </Link>
        <Link href="/comprar" className="hover:underline">
          Ver propiedades en venta
        </Link>
      </div>
    </div>
  );
}
