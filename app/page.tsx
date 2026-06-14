import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllListings, getZonas } from '@/lib/listings-repo';
import { isFeatured, getTopList, slugify } from '@/lib/listings';
import { HeroSearch } from '@/components/HeroSearch';
import { PropertyCard } from '@/components/PropertyCard';
import { TopListRow } from '@/components/TopListRow';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export default async function HomePage() {
  const all = await getAllListings();
  const featured = all.filter((l) => isFeatured(l)).slice(0, 6);
  const zonas = (await getZonas()).slice(0, 6);

  const masCaras = getTopList(all, 'mas-caras-venta');
  const deptosRecientes = getTopList(all, 'departamentos-recientes');
  const casasAlquiler = getTopList(all, 'casas-alquiler');

  return (
    <>
      {/* Hero */}
      <section className="relative bg-sand">
        <div className="container-content py-12 sm:py-16">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h1 className="font-serif text-3xl font-semibold text-forest sm:text-5xl">
              Encontrá tu lugar en Paraguay
            </h1>
            <p className="mt-3 text-base text-ink/70 sm:text-lg">
              Casas, departamentos y terrenos en venta y alquiler. La forma más
              tranquila y agradable de buscar propiedad.
            </p>
          </div>
          <HeroSearch />
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-content py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Propiedades destacadas</h2>
              <p className="mt-1 text-sm text-muted">
                Una selección de lo mejor disponible ahora.
              </p>
            </div>
            <Link
              href="/comprar"
              className="hidden items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark sm:inline-flex"
            >
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing, i) => (
              <PropertyCard key={listing.id} listing={listing} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      {/* Top lists */}
      <section className="bg-cream py-14">
        <div className="container-content space-y-12">
          <TopListRow title="Más caras en venta" listings={masCaras} />
          <TopListRow title="Departamentos recientes" listings={deptosRecientes} />
          <TopListRow title="Casas en alquiler" listings={casasAlquiler} />
        </div>
      </section>

      {/* Neighborhoods */}
      {zonas.length > 0 && (
        <section className="container-content py-14">
          <h2 className="section-title mb-2">Explorá por zona</h2>
          <p className="mb-6 text-sm text-muted">
            Las zonas más buscadas de Asunción y el Gran Asunción.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {zonas.map((zona) => {
              const lugar = slugify(zona.barrio || zona.ciudad);
              return (
                <Link
                  key={`${zona.ciudad}-${zona.barrio}`}
                  href={`/comprar/casas/${lugar}`}
                  className="group relative aspect-[16/9] overflow-hidden rounded-card bg-cream shadow-card"
                >
                  <ImageWithFallback
                    src={`prop${(zonas.indexOf(zona) % 6) + 1}-1.jpg`}
                    alt={zona.barrio || zona.ciudad}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/85 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <p className="font-serif text-lg font-semibold">
                      {zona.barrio || zona.ciudad}
                    </p>
                    <p className="text-xs text-white/80">
                      {zona.ciudad} · {zona.count}{' '}
                      {zona.count === 1 ? 'propiedad' : 'propiedades'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Editorial placeholder band (left intentionally light for Phase 2 news) */}
      <section className="bg-sand">
        <div className="container-content flex flex-col items-center gap-4 py-12 text-center">
          <h2 className="section-title">¿Sos inmobiliaria?</h2>
          <p className="max-w-xl text-sm text-ink/70">
            Pronto vas a poder publicar tus propiedades en Vivienda Paraguay y
            llegar a miles de personas buscando su próximo hogar.
          </p>
          <Link href="/" className="btn-clay">
            Publicar propiedades
          </Link>
        </div>
      </section>
    </>
  );
}
