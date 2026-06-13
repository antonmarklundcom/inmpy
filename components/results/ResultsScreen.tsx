import { getAllListings } from "@/lib/listings-repo";
import { parseListingQuery } from "@/lib/query";
import { buildLandingContent, resolveLugarLabel } from "@/lib/landing";
import { PLURAL_TO_TIPO } from "@/lib/listings";
import type { Sort, Tipo } from "@/lib/listings-schema";
import { ResultsView } from "./ResultsView";

interface Props {
  operacion: "venta" | "alquiler";
  tipoPlural?: string;
  lugarSlug?: string;
  searchParams: Record<string, string | string[] | undefined>;
}

/**
 * Shared server screen for every results / SEO-landing route. The path
 * segments preset operación / tipo / lugar; everything else comes from query
 * params. On the [tipo] and [tipo]/[lugar] variants it also renders the SEO
 * H1 + intro paragraph above the results.
 */
export async function ResultsScreen({
  operacion,
  tipoPlural,
  lugarSlug,
  searchParams,
}: Props) {
  const allListings = await getAllListings();
  const query = parseListingQuery(searchParams);

  const presetTipo: Tipo | undefined = tipoPlural
    ? PLURAL_TO_TIPO[tipoPlural]
    : undefined;
  const lugarLabel = lugarSlug
    ? resolveLugarLabel(allListings, lugarSlug)
    : undefined;

  // Seed initial filter state: path presets win, query params fill the rest.
  const initialTipos: Tipo[] = presetTipo
    ? [presetTipo]
    : query.tipo ?? [];
  const initialLugar = query.lugar ?? lugarLabel ?? "";

  const landing =
    tipoPlural &&
    buildLandingContent(allListings, {
      operacion,
      tipoPlural,
      lugarSlug,
    });

  return (
    <div className="container-page py-8 sm:py-10">
      {landing ? (
        <header className="mb-8 max-w-3xl">
          <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
            {landing.h1}
          </h1>
          <p className="mt-3 text-muted">{landing.intro}</p>
        </header>
      ) : (
        <header className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
            {operacion === "venta"
              ? "Propiedades en venta"
              : "Propiedades en alquiler"}{" "}
            en Paraguay
          </h1>
          <p className="mt-2 text-muted">
            Filtrá por tipo, zona, precio y características.
          </p>
        </header>
      )}

      <ResultsView
        allListings={allListings}
        preset={{ operacion, tipo: presetTipo, lugar: lugarSlug, lugarLabel }}
        initial={{
          tipos: initialTipos,
          lugar: initialLugar,
          precioMin: query.precioMin,
          precioMax: query.precioMax,
          dormitorios: query.dormitorios,
          banos: query.banos,
          superficieMin: query.superficieMin,
          superficieMax: query.superficieMax,
          caracteristicas: query.caracteristicas ?? [],
          sort: (query.sort as Sort) ?? "relevancia",
        }}
      />
    </div>
  );
}
