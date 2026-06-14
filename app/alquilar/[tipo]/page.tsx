import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResultsScreen } from "@/components/results/ResultsScreen";
import { getAllListings, getStaticLandingParams } from "@/lib/listings-repo";
import { buildLandingContent } from "@/lib/landing";
import { PLURAL_TO_TIPO } from "@/lib/listings";

export const dynamicParams = false;

export async function generateStaticParams() {
  const params = await getStaticLandingParams();
  const seen = new Set<string>();
  const out: { tipo: string }[] = [];
  for (const p of params) {
    if (p.operacion !== "alquilar" || p.lugar) continue;
    if (seen.has(p.tipo)) continue;
    seen.add(p.tipo);
    out.push({ tipo: p.tipo });
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tipo: string }>;
}): Promise<Metadata> {
  const { tipo } = await params;
  const listings = await getAllListings();
  const content = buildLandingContent(listings, {
    operacion: "alquiler",
    tipoPlural: tipo,
  });
  return {
    title: content.title,
    description: content.description,
    openGraph: { title: content.title, description: content.description },
  };
}

export default async function AlquilarTipoPage({
  params,
  searchParams,
}: {
  params: Promise<{ tipo: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { tipo } = await params;
  if (!PLURAL_TO_TIPO[tipo]) notFound();
  const listings = await getAllListings();
  const { count } = buildLandingContent(listings, {
    operacion: "alquiler",
    tipoPlural: tipo,
  });
  if (count === 0) notFound();
  const sp = await searchParams;
  return (
    <ResultsScreen operacion="alquiler" tipoPlural={tipo} searchParams={sp} />
  );
}
