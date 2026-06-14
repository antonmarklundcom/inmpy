import Link from 'next/link';
import { Home, Instagram, Facebook, Youtube } from 'lucide-react';
import { SITE_NAME } from '@/lib/config';

const explorar = [
  { href: '/comprar/casas', label: 'Casas en venta' },
  { href: '/comprar/departamentos', label: 'Departamentos en venta' },
  { href: '/comprar/terrenos', label: 'Terrenos' },
  { href: '/alquilar/departamentos', label: 'Departamentos en alquiler' },
  { href: '/alquilar/casas', label: 'Casas en alquiler' },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-forest text-white">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-white/10">
              <Home className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="font-serif text-xl font-semibold">Vivienda Paraguay</span>
          </div>
          <p className="max-w-xs text-sm text-white/70">
            El lugar más tranquilo y agradable para buscar tu próxima propiedad
            en Paraguay.
          </p>
        </div>

        <div>
          <h2 className="mb-4 font-serif text-lg font-semibold">Explorar</h2>
          <ul className="space-y-2 text-sm text-white/80">
            {explorar.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-serif text-lg font-semibold">Contacto</h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Asunción, Paraguay</li>
            <li>
              <a href="mailto:hola@vivienda.com.py" className="hover:text-white">
                hola@vivienda.com.py
              </a>
            </li>
          </ul>
          <h3 className="mb-3 mt-6 font-serif text-base font-semibold">Seguinos</h3>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            © {year} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <p>Portal inmobiliario · Paraguay · es-PY</p>
        </div>
      </div>
    </footer>
  );
}
