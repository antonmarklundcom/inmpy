import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllListings } from "@/lib/listings-repo";
import { getTopList, isFeatured } from "@/lib/listings";
import { SearchCard } from "@/components/SearchCard";
import { PropertyCard } from "@/components/PropertyCard";
import { TopListRow } from "@/components/TopListRow";
import { ImageWithFallback } from "@/components/ImageWithFallback";

const ZONAS: { label: string; href: string; img: string }[] = [
  { label: "Villa Morra", href: "/comprar/casas/villa-morra", img: "prop1-1.jpg" },
  { label: "Carmelitas", href: "/comprar/departamentos/carmelitas", img: "prop2-1.jpg" },
  { label: "Recoleta", href: "/comprar/casas/recoleta", img: "prop1-2.jpg" },
  { label: "Luque", href: "/comprar/terrenos/luque", img: "prop4-1.jpg" },
  { label: "Lambaré", href: "/comprar/casas/lambare", img: "prop3-1.jpg" },
  { label: "San Lorenzo", href: "/comprar/casas/san-lorenzo", img: "prop1-4.jpg" },
  { label: "Encarnación", href: "/comprar/casas/encarnacion", img: "prop6-1.jpg" },
  { label: "Ciudad del Este", href: "/comprar/departamentos/ciudad-del-este", img: "prop2-6.jpg" },
];

export default async function HomePage() {
  const listings = await getAllListings();
  const destacadas = listings.filter(isFeatured);
  const masCaras = getTopList(listings, "mas-caras-venta");
  const deptosRecientes = getTopList(listings, "departamentos-recientes");
  const casasAlquiler = getTopList(listings, "casas-alquiler");

  return (
    <>
      {/* Hero */}
      <section className="relative bg-sand">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-serif text-3xl font-semibold leading-tight text-forest sm:text-4xl lg:text-5xl">
              Encontrá tu lugar en Paraguay
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
              La forma más calma y agradable de buscar casas, departamentos y
              terrenos en venta y alquiler.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <SearchCard />
          </div>
        </div>
      </section>

      {/* Destacadas */}
      <section className="container-page py-14 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">
              Propiedades destacadas
            </h2>
            <p className="mt-1 text-muted">Selección del equipo de Vivienda.</p>
          </div>
          <Link
            href="/comprar"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark sm:inline-flex"
          >
            Ver todas <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destacadas.map((listing, i) => (
            <PropertyCard key={listing.id} listing={listing} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* Top lists */}
      <section className="bg-cream py-14 sm:py-16">
        <div className="container-page space-y-12">
          <TopListRow title="Más caras en venta" listings={masCaras} />
          <TopListRow title="Departamentos recientes" listings={deptosRecientes} />
          <TopListRow title="Casas en alquiler" listings={casasAlquiler} />
        </div>
      </section>

      {/* Explorá por zona */}
      <section className="container-page py-14 sm:py-16">
        <h2 className="mb-2 font-serif text-2xl font-semibold text-forest sm:text-3xl">
          Explorá por zona
        </h2>
        <p className="mb-6 text-muted">
          Descubrí propiedades en los barrios y ciudades más buscados.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ZONAS.map((z) => (
            <Link
              key={z.href}
              href={z.href}
              className="group relative aspect-[3/2] overflow-hidden rounded-card shadow-soft transition-shadow hover:shadow-card"
            >
              <ImageWithFallback
                src={z.img}
                alt={z.label}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <span className="absolute bottom-3 left-3 font-serif text-lg font-medium text-white">
                {z.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
