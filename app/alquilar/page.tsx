import type { Metadata } from "next";
import { ResultsScreen } from "@/components/results/ResultsScreen";

export const metadata: Metadata = {
  title: "Propiedades en alquiler en Paraguay",
  description:
    "Casas, departamentos, dúplex y oficinas en alquiler en Asunción y todo Paraguay. Precios en Gs. y US$, fotos y contacto directo por WhatsApp.",
};

export default async function AlquilarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <ResultsScreen operacion="alquiler" searchParams={sp} />;
}
