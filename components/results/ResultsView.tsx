"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { List, MapIcon, SlidersHorizontal, X } from "lucide-react";
import type { Listing, Sort, Tipo } from "@/lib/listings-schema";
import {
  filterListings,
  sortListings,
  TIPO_LABEL,
  TIPO_PLURAL,
} from "@/lib/listings";
import { FX_PYG_USD } from "@/lib/config";
import { PropertyCard } from "@/components/PropertyCard";

const ResultsMap = dynamic(() => import("./ResultsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] min-h-[420px] w-full items-center justify-center rounded-card bg-cream text-muted">
      Cargando mapa…
    </div>
  ),
});

export interface ResultsPreset {
  operacion: "venta" | "alquiler";
  tipo?: Tipo;
  lugar?: string;
  lugarLabel?: string;
}

interface InitialFilters {
  tipos: Tipo[];
  lugar: string;
  precioMin?: number;
  precioMax?: number;
  dormitorios?: number;
  banos?: number;
  superficieMin?: number;
  superficieMax?: number;
  caracteristicas: string[];
  sort: Sort;
}

interface Props {
  allListings: Listing[];
  preset: ResultsPreset;
  initial: InitialFilters;
}

const TIPOS: Tipo[] = [
  "casa",
  "departamento",
  "duplex",
  "terreno",
  "oficina",
  "local",
];

const SORTS: { value: Sort; label: string }[] = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "recientes", label: "Más recientes" },
  { value: "superficie", label: "Mayor superficie" },
];

const ROOM_STEPS = [1, 2, 3, 4];

export function ResultsView({ allListings, preset, initial }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [operacion, setOperacion] = useState<"venta" | "alquiler">(
    preset.operacion
  );
  const [tipos, setTipos] = useState<Tipo[]>(initial.tipos);
  const [lugar, setLugar] = useState(initial.lugar);
  const [precioMin, setPrecioMin] = useState<number | undefined>(
    initial.precioMin
  );
  const [precioMax, setPrecioMax] = useState<number | undefined>(
    initial.precioMax
  );
  const [priceUnit, setPriceUnit] = useState<"usd" | "gs">("usd");
  const [dormitorios, setDormitorios] = useState<number | undefined>(
    initial.dormitorios
  );
  const [banos, setBanos] = useState<number | undefined>(initial.banos);
  const [superficieMin, setSuperficieMin] = useState<number | undefined>(
    initial.superficieMin
  );
  const [superficieMax, setSuperficieMax] = useState<number | undefined>(
    initial.superficieMax
  );
  const [caracteristicas, setCaracteristicas] = useState<string[]>(
    initial.caracteristicas
  );
  const [sort, setSort] = useState<Sort>(initial.sort);
  const [view, setView] = useState<"list" | "map">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allCaracteristicas = useMemo(() => {
    const set = new Set<string>();
    for (const l of allListings) for (const c of l.caracteristicas) set.add(c);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [allListings]);

  const filters = useMemo(
    () => ({
      operacion,
      tipo: tipos.length ? tipos : undefined,
      lugar: lugar.trim() || undefined,
      precioMin,
      precioMax,
      dormitorios,
      banos,
      superficieMin,
      superficieMax,
      caracteristicas: caracteristicas.length ? caracteristicas : undefined,
      sort,
    }),
    [
      operacion,
      tipos,
      lugar,
      precioMin,
      precioMax,
      dormitorios,
      banos,
      superficieMin,
      superficieMax,
      caracteristicas,
      sort,
    ]
  );

  const results = useMemo(
    () => sortListings(filterListings(allListings, filters), sort),
    [allListings, filters, sort]
  );

  /* ---- URL sync (shareable). Operación lives in the path; omit tipo/lugar
         when they match the path preset to keep landing URLs clean. ---- */
  function syncUrl(next: Partial<Record<string, string | undefined>>) {
    const sp = new URLSearchParams();
    const tiposFinal = next.tipo ?? tipos.join(",");
    const isPresetTipo =
      preset.tipo && tiposFinal === preset.tipo && tipos.length === 1;
    if (tiposFinal && !isPresetTipo) sp.set("tipo", tiposFinal);

    const lugarFinal = next.lugar ?? (lugar.trim() || "");
    if (lugarFinal && lugarFinal.toLowerCase() !== (preset.lugarLabel ?? "").toLowerCase())
      sp.set("lugar", lugarFinal);

    if (precioMin != null) sp.set("precioMin", String(precioMin));
    if (precioMax != null) sp.set("precioMax", String(precioMax));
    if (dormitorios != null) sp.set("dormitorios", String(dormitorios));
    if (banos != null) sp.set("banos", String(banos));
    if (superficieMin != null) sp.set("superficieMin", String(superficieMin));
    if (superficieMax != null) sp.set("superficieMax", String(superficieMax));
    if (caracteristicas.length) sp.set("caracteristicas", caracteristicas.join(","));
    if (sort !== "relevancia") sp.set("sort", sort);

    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleTipo(t: Tipo) {
    const next = tipos.includes(t)
      ? tipos.filter((x) => x !== t)
      : [...tipos, t];
    setTipos(next);
    queueMicrotask(() => syncUrl({ tipo: next.join(",") }));
  }

  function toggleCaracteristica(c: string) {
    const next = caracteristicas.includes(c)
      ? caracteristicas.filter((x) => x !== c)
      : [...caracteristicas, c];
    setCaracteristicas(next);
    queueMicrotask(() => syncUrl({}));
  }

  function priceToInput(usd?: number) {
    if (usd == null) return "";
    return priceUnit === "gs" ? String(Math.round(usd * FX_PYG_USD)) : String(usd);
  }
  function inputToUsd(value: string): number | undefined {
    if (value === "") return undefined;
    const n = Number(value);
    if (!Number.isFinite(n)) return undefined;
    return priceUnit === "gs" ? Math.round(n / FX_PYG_USD) : n;
  }

  function clearAll() {
    setTipos(preset.tipo ? [preset.tipo] : []);
    setLugar(preset.lugarLabel ?? "");
    setPrecioMin(undefined);
    setPrecioMax(undefined);
    setDormitorios(undefined);
    setBanos(undefined);
    setSuperficieMin(undefined);
    setSuperficieMax(undefined);
    setCaracteristicas([]);
    setSort("relevancia");
    router.replace(pathname, { scroll: false });
  }

  // Active-filter chips (everything beyond the path presets)
  const activeChips: { label: string; onRemove: () => void }[] = [];
  for (const t of tipos) {
    if (preset.tipo === t && tipos.length === 1) continue;
    activeChips.push({
      label: TIPO_LABEL[t].singular,
      onRemove: () => toggleTipo(t),
    });
  }
  if (lugar.trim() && lugar.trim().toLowerCase() !== (preset.lugarLabel ?? "").toLowerCase())
    activeChips.push({
      label: `“${lugar.trim()}”`,
      onRemove: () => {
        setLugar(preset.lugarLabel ?? "");
        queueMicrotask(() => syncUrl({ lugar: preset.lugarLabel ?? "" }));
      },
    });
  if (precioMin != null)
    activeChips.push({
      label: `Desde US$ ${precioMin.toLocaleString("es-PY")}`,
      onRemove: () => {
        setPrecioMin(undefined);
        queueMicrotask(() => syncUrl({}));
      },
    });
  if (precioMax != null)
    activeChips.push({
      label: `Hasta US$ ${precioMax.toLocaleString("es-PY")}`,
      onRemove: () => {
        setPrecioMax(undefined);
        queueMicrotask(() => syncUrl({}));
      },
    });
  if (dormitorios != null)
    activeChips.push({
      label: `${dormitorios}+ dorm.`,
      onRemove: () => {
        setDormitorios(undefined);
        queueMicrotask(() => syncUrl({}));
      },
    });
  if (banos != null)
    activeChips.push({
      label: `${banos}+ baños`,
      onRemove: () => {
        setBanos(undefined);
        queueMicrotask(() => syncUrl({}));
      },
    });
  for (const c of caracteristicas)
    activeChips.push({ label: c, onRemove: () => toggleCaracteristica(c) });

  const panel = (
    <div className="space-y-6">
      {/* Operación */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">Operación</legend>
        <div className="inline-flex rounded-control bg-cream p-1">
          {(["venta", "alquiler"] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => {
                setOperacion(op);
                router.push(op === "venta" ? "/comprar" : "/alquilar");
              }}
              className={`rounded-[6px] px-4 py-1.5 text-sm font-medium transition-colors ${
                operacion === op
                  ? "bg-white text-primary shadow-soft"
                  : "text-muted hover:text-text"
              }`}
            >
              {op === "venta" ? "Comprar" : "Alquilar"}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Tipo */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">
          Tipo de propiedad
        </legend>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTipo(t)}
              className={`chip ${tipos.includes(t) ? "chip-active" : ""} ${
                preset.tipo === t ? "ring-1 ring-primary/40" : ""
              }`}
              aria-pressed={tipos.includes(t)}
            >
              {TIPO_LABEL[t].singular}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Ubicación */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">Ubicación</legend>
        <input
          type="text"
          value={lugar}
          onChange={(e) => setLugar(e.target.value)}
          onBlur={() => syncUrl({})}
          onKeyDown={(e) => e.key === "Enter" && syncUrl({})}
          placeholder="Barrio, ciudad o departamento"
          className="input"
        />
      </fieldset>

      {/* Precio */}
      <fieldset>
        <div className="mb-2 flex items-center justify-between">
          <legend className="text-sm font-semibold text-text">Precio</legend>
          <div className="inline-flex rounded-control bg-cream p-0.5 text-xs">
            {(["usd", "gs"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setPriceUnit(u)}
                className={`rounded-[5px] px-2 py-1 font-medium transition-colors ${
                  priceUnit === u ? "bg-white text-primary shadow-soft" : "text-muted"
                }`}
              >
                {u === "usd" ? "US$" : "Gs."}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Mín."
            value={priceToInput(precioMin)}
            onChange={(e) => setPrecioMin(inputToUsd(e.target.value))}
            onBlur={() => syncUrl({})}
            className="input"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Máx."
            value={priceToInput(precioMax)}
            onChange={(e) => setPrecioMax(inputToUsd(e.target.value))}
            onBlur={() => syncUrl({})}
            className="input"
          />
        </div>
      </fieldset>

      {/* Dormitorios */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">Dormitorios</legend>
        <div className="flex gap-2">
          {ROOM_STEPS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                const v = dormitorios === n ? undefined : n;
                setDormitorios(v);
                queueMicrotask(() => syncUrl({}));
              }}
              className={`chip ${dormitorios === n ? "chip-active" : ""}`}
            >
              {n}+
            </button>
          ))}
        </div>
      </fieldset>

      {/* Baños */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">Baños</legend>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                const v = banos === n ? undefined : n;
                setBanos(v);
                queueMicrotask(() => syncUrl({}));
              }}
              className={`chip ${banos === n ? "chip-active" : ""}`}
            >
              {n}+
            </button>
          ))}
        </div>
      </fieldset>

      {/* Superficie */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">
          Superficie (m²)
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Mín."
            value={superficieMin ?? ""}
            onChange={(e) =>
              setSuperficieMin(e.target.value ? Number(e.target.value) : undefined)
            }
            onBlur={() => syncUrl({})}
            className="input"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Máx."
            value={superficieMax ?? ""}
            onChange={(e) =>
              setSuperficieMax(e.target.value ? Number(e.target.value) : undefined)
            }
            onBlur={() => syncUrl({})}
            className="input"
          />
        </div>
      </fieldset>

      {/* Características */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">
          Características
        </legend>
        <div className="grid max-h-56 grid-cols-1 gap-1.5 overflow-y-auto pr-1">
          {allCaracteristicas.map((c) => (
            <label
              key={c}
              className="flex cursor-pointer items-center gap-2 text-sm text-text"
            >
              <input
                type="checkbox"
                checked={caracteristicas.includes(c)}
                onChange={() => toggleCaracteristica(c)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-card border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-forest">Filtros</h2>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Limpiar
            </button>
          </div>
          {panel}
        </div>
      </aside>

      {/* Main */}
      <div>
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="font-semibold text-text">{results.length}</span>{" "}
            {results.length === 1 ? "propiedad" : "propiedades"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="btn-outline lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filtros
            </button>
            <label className="sr-only" htmlFor="sort">
              Ordenar
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => {
                const v = e.target.value as Sort;
                setSort(v);
                queueMicrotask(() => syncUrl({}));
              }}
              className="input w-auto py-2"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="inline-flex rounded-control border border-border p-0.5">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-sm font-medium ${
                  view === "list" ? "bg-primary text-white" : "text-muted"
                }`}
                aria-pressed={view === "list"}
              >
                <List className="h-4 w-4" aria-hidden />
                Lista
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-sm font-medium ${
                  view === "map" ? "bg-primary text-white" : "text-muted"
                }`}
                aria-pressed={view === "map"}
              >
                <MapIcon className="h-4 w-4" aria-hidden />
                Mapa
              </button>
            </div>
          </div>
        </div>

        {/* Active chips */}
        {activeChips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {activeChips.map((chip, i) => (
              <button
                key={`${chip.label}-${i}`}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20"
              >
                {chip.label}
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-muted underline hover:text-text"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* Results */}
        {results.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-cream/50 px-6 py-20 text-center">
            <p className="font-serif text-xl text-forest">
              No encontramos propiedades con esos filtros
            </p>
            <p className="mt-2 text-muted">
              Probá ampliar el rango de precio o quitar algún filtro.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="btn-outline mx-auto mt-5"
            >
              Limpiar filtros
            </button>
          </div>
        ) : view === "list" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((l, i) => (
              <PropertyCard key={l.id} listing={l} priority={i < 3} />
            ))}
          </div>
        ) : (
          <ResultsMap listings={results} />
        )}
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-white p-5 shadow-float">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-forest">Filtros</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Cerrar filtros"
                className="rounded-full p-1.5 hover:bg-cream"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {panel}
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={clearAll} className="btn-outline flex-1">
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="btn-primary flex-1"
              >
                Ver {results.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
