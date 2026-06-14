import { NextResponse } from 'next/server';
import { queryListings } from '@/lib/listings-repo';
import { parseListingQuery } from '@/lib/query';
import { listingQuerySchema } from '@/lib/listings-schema';

/**
 * GET /api/v1/listings — read-only, forward-compatible listings API.
 *
 * Accepts the same filter/sort query params as the results pages, validates
 * them with zod, and reads exclusively through `lib/listings-repo.ts`. In
 * Phase 2 the repo body swaps to Supabase behind this same contract.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Translate URL params → typed query, then validate with zod.
  const parsed = parseListingQuery(searchParams);
  const result = listingQuerySchema.safeParse(parsed);
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Parámetros de consulta inválidos',
        issues: result.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { items, total } = await queryListings(result.data);

  return NextResponse.json(
    { items, total, query: result.data },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' } },
  );
}
