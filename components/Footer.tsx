import Link from "next/link";
import { Facebook, Instagram, Home, Mail, Phone } from "lucide-react";
import { SITE_NAME } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 bg-forest text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Home className="h-5 w-5 text-white" aria-hidden />
            </span>
            <div className="leading-none">
              <p className="font-serif text-xl font-semibold">Vivienda</p>
              <p className="text-[11px] uppercase tracking-wide text-white/60">
                Paraguay
              </p>
            </div>
          </div>
          <p className="max-w-xs text-sm text-white/70">
            El lugar más agradable para buscar propiedades en Paraguay. Casas,
            departamentos y terrenos en venta y alquiler.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-lg text-white">Contacto</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden />
              hola@vivienda.com.py
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" aria-hidden />
              +595 21 000 000
            </li>
            <li>Asunción, Paraguay</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-4 font-serif text-lg text-white">Explorar</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="/comprar" className="hover:text-white">
                  Comprar
                </Link>
              </li>
              <li>
                <Link href="/alquilar" className="hover:text-white">
                  Alquilar
                </Link>
              </li>
              <li>
                <Link href="/comprar/casas" className="hover:text-white">
                  Casas en venta
                </Link>
              </li>
              <li>
                <Link href="/comprar/departamentos" className="hover:text-white">
                  Departamentos
                </Link>
              </li>
              <li>
                <Link href="/guardados" className="hover:text-white">
                  Guardados
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-serif text-lg text-white">Seguinos</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <p>Precios de referencia. Verificá los datos con cada inmobiliaria.</p>
        </div>
      </div>
    </footer>
  );
}
