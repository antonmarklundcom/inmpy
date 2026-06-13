import { NextResponse, type NextRequest } from "next/server";
import { queryListings } from "@/lib/listings-repo";
import { parseListingQuery } from "@/lib/query";

/**
 * GET /api/v1/listings
 *
 * Read-only, forward-compatible listings endpoint. Accepts the same filter /
 * sort query params as the results pages. Inputs are validated by zod (via
 * parseListingQuery); data is fetched ONLY through lib/listings-repo.ts, never
 * the seed array. Phase 2 swaps the repo source for a DB behind this contract.
 */
export async function GET(request: NextRequest) {
  const query = parseListingQuery(request.nextUrl.searchParams);
  const { items, total } = await queryListings(query);

  return NextResponse.json(
    {
      data: items,
      meta: {
        total,
        page: query.page ?? 1,
        perPage: query.perPage ?? total,
        filters: query,
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
