import type { Metadata } from "next";
import { ResultsScreen } from "@/components/results/ResultsScreen";

export const metadata: Metadata = {
  title: "Propiedades en venta en Paraguay",
  description:
    "Casas, departamentos, dúplex, terrenos y oficinas en venta en Asunción y todo Paraguay. Precios en Gs. y US$, fotos y contacto directo por WhatsApp.",
};

export default async function ComprarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <ResultsScreen operacion="venta" searchParams={sp} />;
}
