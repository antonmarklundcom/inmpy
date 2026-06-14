import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResultsScreen } from "@/components/results/ResultsScreen";
import { getAllListings, getStaticLandingParams } from "@/lib/listings-repo";
import { buildLandingContent } from "@/lib/landing";
import { PLURAL_TO_TIPO } from "@/lib/listings";

export const dynamicParams = false;

export async function generateStaticParams() {
  const params = await getStaticLandingParams();
  const out: { tipo: string; lugar: string }[] = [];
  for (const p of params) {
    if (p.operacion !== "alquilar" || !p.lugar) continue;
    out.push({ tipo: p.tipo, lugar: p.lugar });
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tipo: string; lugar: string }>;
}): Promise<Metadata> {
  const { tipo, lugar } = await params;
  const listings = await getAllListings();
  const content = buildLandingContent(listings, {
    operacion: "alquiler",
    tipoPlural: tipo,
    lugarSlug: lugar,
  });
  return {
    title: content.title,
    description: content.description,
    openGraph: { title: content.title, description: content.description },
  };
}

export default async function AlquilarTipoLugarPage({
  params,
  searchParams,
}: {
  params: Promise<{ tipo: string; lugar: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { tipo, lugar } = await params;
  if (!PLURAL_TO_TIPO[tipo]) notFound();
  // 404 unknown / empty location combos (noindex by omission, like the sitemap).
  const listings = await getAllListings();
  const { count } = buildLandingContent(listings, {
    operacion: "alquiler",
    tipoPlural: tipo,
    lugarSlug: lugar,
  });
  if (count === 0) notFound();
  const sp = await searchParams;
  return (
    <ResultsScreen
      operacion="alquiler"
      tipoPlural={tipo}
      lugarSlug={lugar}
      searchParams={sp}
    />
  );
}
