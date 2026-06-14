import type { Metadata } from 'next';
import { resolveLanding, buildLandingMetadata } from '@/lib/landing';
import { getStaticLandingParams } from '@/lib/listings-repo';
import { ResultsPage } from '@/components/results/ResultsPage';

type SearchParams = { [key: string]: string | string[] | undefined };
type Params = { tipo: string };

export async function generateStaticParams(): Promise<Params[]> {
  const combos = await getStaticLandingParams();
  return combos
    .filter((c) => c.operacion === 'alquilar' && !c.lugar)
    .map((c) => ({ tipo: c.tipo }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const ctx = await resolveLanding({ operacionSlug: 'alquilar', tipoSlug: params.tipo });
  return ctx ? buildLandingMetadata(ctx) : {};
}

export default function AlquilarTipoPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <ResultsPage
      operacionSlug="alquilar"
      tipoSlug={params.tipo}
      searchParams={searchParams}
    />
  );
}
