import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Home className="h-8 w-8 text-primary" aria-hidden />
      </span>
      <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
        No encontramos esta página
      </h1>
      <p className="mt-3 max-w-md text-muted">
        Es posible que la propiedad ya no esté disponible o que el enlace haya
        cambiado. Probá buscar de nuevo.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/comprar" className="btn-primary">
          <Search className="h-5 w-5" aria-hidden />
          Buscar propiedades
        </Link>
        <Link href="/" className="btn-outline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
