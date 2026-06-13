import type { Metadata } from "next";
import { getAllListings } from "@/lib/listings-repo";
import { GuardadosView } from "@/components/GuardadosView";

export const metadata: Metadata = {
  title: "Propiedades guardadas",
  description: "Tus propiedades guardadas en Vivienda Paraguay.",
  robots: { index: false, follow: false },
};

export default async function GuardadosPage() {
  const all = await getAllListings();
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Guardados
        </h1>
        <p className="mt-2 text-muted">
          Las propiedades que guardaste se almacenan en este dispositivo.
        </p>
      </header>
      <GuardadosView allListings={all} />
    </div>
  );
}
