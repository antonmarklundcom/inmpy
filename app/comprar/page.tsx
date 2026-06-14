import type { Metadata } from 'next';
import { resolveLanding, buildLandingMetadata } from '@/lib/landing';
import { ResultsPage } from '@/components/results/ResultsPage';

type SearchParams = { [key: string]: string | string[] | undefined };

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await resolveLanding({ operacionSlug: 'comprar' });
  return ctx ? buildLandingMetadata(ctx) : {};
}

export default function ComprarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return <ResultsPage operacionSlug="comprar" searchParams={searchParams} />;
}
