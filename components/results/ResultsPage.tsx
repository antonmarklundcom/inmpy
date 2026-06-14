import { notFound } from 'next/navigation';
import { resolveLanding, mergeQuery } from '@/lib/landing';
import { queryListings, getAllCaracteristicas } from '@/lib/listings-repo';
import { parseListingQuery } from '@/lib/query';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { ResultsView } from './ResultsView';

interface Props {
  operacionSlug: string;
  tipoSlug?: string;
  lugarSlug?: string;
  searchParams: Record<string, string | string[] | undefined>;
}

/**
 * Shared server component behind every results / SEO landing route. The path
 * segments preset part of the query; everything else comes from query params.
 */
export async function ResultsPage({
  operacionSlug,
  tipoSlug,
  lugarSlug,
  searchParams,
}: Props) {
  const ctx = await resolveLanding({ operacionSlug, tipoSlug, lugarSlug });
  if (!ctx) notFound();

  const parsed = parseListingQuery(searchParams);
  const effective = mergeQuery(ctx.presetQuery, parsed);

  const { items, total } = await queryListings(effective);
  const caracteristicas = await getAllCaracteristicas();

  // SEO furniture only on the [tipo] and [tipo]/[lugar] routes.
  const crumbs = [
    { name: 'Inicio', path: '/' },
    {
      name: ctx.operacion === 'venta' ? 'Comprar' : 'Alquilar',
      path: `/${ctx.operacionSlug}`,
    },
  ];
  if (tipoSlug) {
    crumbs.push({ name: ctx.h1, path: `/${ctx.canonicalPath}` });
  }

  return (
    <>
      {ctx.isLanding && (
        <>
          <JsonLd data={breadcrumbJsonLd(crumbs)} />
          <JsonLd data={itemListJsonLd(items)} />
        </>
      )}
      <ResultsView
        listings={items}
        total={total}
        query={effective}
        caracteristicas={caracteristicas}
        seo={ctx.isLanding ? { h1: ctx.h1, intro: ctx.intro } : null}
      />
    </>
  );
}
