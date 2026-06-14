import { NextResponse } from 'next/server';
import { getListingBySlug } from '@/lib/listings-repo';

/** GET /api/v1/listings/[slug] — single listing or 404, via the repo. */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const listing = await getListingBySlug(params.slug);
  if (!listing) {
    return NextResponse.json(
      { error: 'Propiedad no encontrada' },
      { status: 404 },
    );
  }
  return NextResponse.json(
    { item: listing },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' } },
  );
}
