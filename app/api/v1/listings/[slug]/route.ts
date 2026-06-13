import { NextResponse } from "next/server";
import { getListingBySlug } from "@/lib/listings-repo";

/**
 * GET /api/v1/listings/[slug] — one listing or 404, via the repo.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    return NextResponse.json(
      { error: "Listing not found", slug },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { data: listing },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
