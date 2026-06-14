import type { Metadata } from 'next';
import { getAllListings } from '@/lib/listings-repo';
import { SavedList } from './SavedList';

export const metadata: Metadata = {
  title: 'Propiedades guardadas',
  description: 'Tus propiedades favoritas guardadas en Vivienda Paraguay.',
  robots: { index: false },
};

export default async function GuardadosPage() {
  // Pass the full catalog to the client; it filters by the localStorage set.
  const all = await getAllListings();
  return (
    <div className="container-content py-10">
      <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
        Propiedades guardadas
      </h1>
      <p className="mt-2 text-muted">
        Las propiedades que marcaste con el corazón se guardan en este navegador.
      </p>
      <SavedList listings={all} />
    </div>
  );
}
