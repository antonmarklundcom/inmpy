'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  SlidersHorizontal,
  Map as MapIcon,
  List as ListIcon,
  X,
  Search,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ListingQuery, Operacion, Tipo } from '@/lib/types';
import type { Listing } from '@/lib/types';
import { serializeListingQuery } from '@/lib/query';
import { FX_PYG_USD } from '@/lib/config';
import { TIPOS, TIPO_SINGULAR } from '@/lib/taxonomy';
import { PropertyCard } from '@/components/PropertyCard';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] min-h-[400px] items-center justify-center rounded-card border border-line bg-cream text-sm text-muted">
      Cargando mapa…
    </div>
  ),
});

interface Props {
  listings: Listing[];
  total: number;
  query: ListingQuery;
  caracteristicas: string[];
  seo?: { h1: string; intro: string } | null;
}

const SORT_OPTIONS: { value: NonNullable<ListingQuery['sort']>; label: string }[] = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'recientes', label: 'Más recientes' },
  { value: 'superficie', label: 'Mayor superficie' },
];

export function ResultsView({ listings, total, query, caracteristicas, seo }: Props) {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);

  function navigate(next: ListingQuery) {
    const op: Operacion = next.operacion ?? 'venta';
    const base = op === 'venta' ? '/comprar' : '/alquilar';
    const sp = serializeListingQuery(next);
    sp.delete('operacion');
    const qs = sp.toString();
    router.push(qs ? `${base}?${qs}` : base, { scroll: false });
  }

  const update = (patch: Partial<ListingQuery>) => navigate({ ...query, ...patch });

  return (
    <div className="container-content py-8">
      {seo && (
        <header className="mb-6 max-w-3xl">
          <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
            {seo.h1}
          </h1>
          <p className="mt-2 text-muted">{seo.intro}</p>
        </header>
      )}

      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Filter sidebar */}
        <aside
          className={`${
            filtersOpen ? 'block' : 'hidden'
          } mb-6 lg:mb-0 lg:block`}
        >
          <div className="sticky top-32 space-y-6 rounded-card border border-line bg-white p-5">
            <FilterPanel
              query={query}
              caracteristicas={caracteristicas}
              update={update}
              navigate={navigate}
            />
          </div>
        </aside>

        {/* Results column */}
        <div>
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">{total}</span>{' '}
              {total === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="btn-outline px-3 py-2 text-sm lg:hidden"
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </button>
              <label className="sr-only" htmlFor="sort">
                Ordenar
              </label>
              <select
                id="sort"
                value={query.sort ?? 'relevancia'}
                onChange={(e) =>
                  update({ sort: e.target.value as ListingQuery['sort'] })
                }
                className="input w-auto py-2 text-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="inline-flex overflow-hidden rounded-control border border-line">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`flex items-center gap-1 px-3 py-2 text-sm ${
                    view === 'list' ? 'bg-primary text-white' : 'bg-white text-ink'
                  }`}
                  aria-pressed={view === 'list'}
                >
                  <ListIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Lista</span>
                </button>
                <button
                  type="button"
                  onClick={() => setView('map')}
                  className={`flex items-center gap-1 px-3 py-2 text-sm ${
                    view === 'map' ? 'bg-primary text-white' : 'bg-white text-ink'
                  }`}
                  aria-pressed={view === 'map'}
                >
                  <MapIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Mapa</span>
                </button>
              </div>
            </div>
          </div>

          <ActiveChips query={query} navigate={navigate} />

          {/* Results */}
          {total === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-cream py-20 text-center">
              <Search className="h-8 w-8 text-muted" />
              <p className="font-serif text-xl font-semibold text-forest">
                No encontramos propiedades con esos filtros
              </p>
              <p className="max-w-sm text-sm text-muted">
                Probá ampliar la zona o quitar algunos filtros para ver más
                opciones.
              </p>
            </div>
          ) : view === 'map' ? (
            <MapView listings={listings} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((l, i) => (
                <PropertyCard key={l.id} listing={l} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────── Filter panel ────────

function FilterPanel({
  query,
  caracteristicas,
  update,
  navigate,
}: {
  query: ListingQuery;
  caracteristicas: string[];
  update: (patch: Partial<ListingQuery>) => void;
  navigate: (next: ListingQuery) => void;
}) {
  const tipos = query.tipo ?? [];

  function toggleTipo(t: Tipo) {
    const set = new Set(tipos);
    if (set.has(t)) set.delete(t);
    else set.add(t);
    update({ tipo: set.size ? [...set] : undefined });
  }

  function toggleCaracteristica(c: string) {
    const set = new Set(query.caracteristicas ?? []);
    if (set.has(c)) set.delete(c);
    else set.add(c);
    update({ caracteristicas: set.size ? [...set] : undefined });
  }

  return (
    <>
      {/* Operación */}
      <div>
        <FilterLabel>Operación</FilterLabel>
        <div className="inline-flex w-full rounded-control bg-cream p-1">
          {(['venta', 'alquiler'] as Operacion[]).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => navigate({ ...query, operacion: op })}
              className={`flex-1 rounded-[6px] px-3 py-1.5 text-sm font-semibold transition-colors ${
                (query.operacion ?? 'venta') === op
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted'
              }`}
            >
              {op === 'venta' ? 'Comprar' : 'Alquilar'}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo */}
      <div>
        <FilterLabel>Tipo de propiedad</FilterLabel>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTipo(t)}
              className={`chip text-xs ${tipos.includes(t) ? 'chip-active' : ''}`}
            >
              {TIPO_SINGULAR[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Ubicación */}
      <div>
        <FilterLabel>Ubicación</FilterLabel>
        <UbicacionInput
          value={query.ubicacion ?? ''}
          onCommit={(v) => update({ ubicacion: v || undefined })}
        />
      </div>

      {/* Precio */}
      <PriceFilter query={query} update={update} />

      {/* Dormitorios */}
      <div>
        <FilterLabel>Dormitorios</FilterLabel>
        <MinButtons
          options={[1, 2, 3, 4]}
          value={query.dormitoriosMin}
          onChange={(v) => update({ dormitoriosMin: v })}
        />
      </div>

      {/* Baños */}
      <div>
        <FilterLabel>Baños</FilterLabel>
        <MinButtons
          options={[1, 2, 3]}
          value={query.banosMin}
          onChange={(v) => update({ banosMin: v })}
        />
      </div>

      {/* Superficie */}
      <div>
        <FilterLabel>Superficie (m²)</FilterLabel>
        <div className="flex items-center gap-2">
          <NumberInput
            placeholder="Mín"
            value={query.superficieMin}
            onCommit={(v) => update({ superficieMin: v })}
          />
          <span className="text-muted">–</span>
          <NumberInput
            placeholder="Máx"
            value={query.superficieMax}
            onCommit={(v) => update({ superficieMax: v })}
          />
        </div>
      </div>

      {/* Características */}
      {caracteristicas.length > 0 && (
        <div>
          <FilterLabel>Características</FilterLabel>
          <ul className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
            {caracteristicas.map((c) => {
              const checked = (query.caracteristicas ?? []).includes(c);
              return (
                <li key={c}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCaracteristica(c)}
                      className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
                    />
                    {c}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
      {children}
    </p>
  );
}

function MinButtons({
  options,
  value,
  onChange,
}: {
  options: number[];
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? undefined : n)}
          className={`flex-1 rounded-control border px-2 py-1.5 text-sm font-medium transition-colors ${
            value === n
              ? 'border-primary bg-primary text-white'
              : 'border-line bg-white text-ink hover:border-primary'
          }`}
        >
          {n}+
        </button>
      ))}
    </div>
  );
}

function UbicacionInput({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);
  return (
    <input
      key={value}
      type="text"
      defaultValue={value}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => onCommit(local.trim())}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onCommit(local.trim());
        }
      }}
      placeholder="Barrio o ciudad"
      className="input"
    />
  );
}

function NumberInput({
  value,
  placeholder,
  onCommit,
}: {
  value: number | undefined;
  placeholder: string;
  onCommit: (v: number | undefined) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      defaultValue={value ?? ''}
      placeholder={placeholder}
      onBlur={(e) => {
        const v = e.target.value === '' ? undefined : Number(e.target.value);
        onCommit(Number.isFinite(v as number) ? (v as number) : undefined);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      className="input"
    />
  );
}

function PriceFilter({
  query,
  update,
}: {
  query: ListingQuery;
  update: (patch: Partial<ListingQuery>) => void;
}) {
  const [unit, setUnit] = useState<'usd' | 'gs'>('usd');
  const toUSD = (raw: string): number | undefined => {
    if (raw === '') return undefined;
    const n = Number(raw);
    if (!Number.isFinite(n)) return undefined;
    return unit === 'gs' ? Math.round(n / FX_PYG_USD) : n;
  };
  const fromUSD = (usd: number | undefined): string => {
    if (usd == null) return '';
    return unit === 'gs' ? String(Math.round(usd * FX_PYG_USD)) : String(usd);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <FilterLabel>Precio</FilterLabel>
        <div className="inline-flex overflow-hidden rounded-md border border-line text-xs">
          {(['usd', 'gs'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`px-2 py-0.5 font-semibold ${
                unit === u ? 'bg-primary text-white' : 'bg-white text-muted'
              }`}
            >
              {u === 'usd' ? 'US$' : 'Gs.'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          key={`min-${unit}-${query.precioMinUSD ?? ''}`}
          type="number"
          min={0}
          placeholder="Mín"
          defaultValue={fromUSD(query.precioMinUSD)}
          onBlur={(e) => update({ precioMinUSD: toUSD(e.target.value) })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          className="input"
        />
        <span className="text-muted">–</span>
        <input
          key={`max-${unit}-${query.precioMaxUSD ?? ''}`}
          type="number"
          min={0}
          placeholder="Máx"
          defaultValue={fromUSD(query.precioMaxUSD)}
          onBlur={(e) => update({ precioMaxUSD: toUSD(e.target.value) })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          className="input"
        />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────── Active chips ────────

function ActiveChips({
  query,
  navigate,
}: {
  query: ListingQuery;
  navigate: (next: ListingQuery) => void;
}) {
  const chips: { label: string; clear: ListingQuery }[] = [];
  const base = { ...query };

  if (query.tipo) {
    for (const t of query.tipo) {
      chips.push({
        label: TIPO_SINGULAR[t],
        clear: { ...base, tipo: query.tipo.filter((x) => x !== t) },
      });
    }
  }
  if (query.ubicacion) {
    chips.push({ label: query.ubicacion, clear: { ...base, ubicacion: undefined } });
  }
  if (query.precioMinUSD != null) {
    chips.push({
      label: `Desde US$ ${query.precioMinUSD.toLocaleString('es-PY')}`,
      clear: { ...base, precioMinUSD: undefined },
    });
  }
  if (query.precioMaxUSD != null) {
    chips.push({
      label: `Hasta US$ ${query.precioMaxUSD.toLocaleString('es-PY')}`,
      clear: { ...base, precioMaxUSD: undefined },
    });
  }
  if (query.dormitoriosMin != null) {
    chips.push({
      label: `${query.dormitoriosMin}+ dorm.`,
      clear: { ...base, dormitoriosMin: undefined },
    });
  }
  if (query.banosMin != null) {
    chips.push({
      label: `${query.banosMin}+ baños`,
      clear: { ...base, banosMin: undefined },
    });
  }
  if (query.superficieMin != null) {
    chips.push({
      label: `Desde ${query.superficieMin} m²`,
      clear: { ...base, superficieMin: undefined },
    });
  }
  if (query.superficieMax != null) {
    chips.push({
      label: `Hasta ${query.superficieMax} m²`,
      clear: { ...base, superficieMax: undefined },
    });
  }
  for (const c of query.caracteristicas ?? []) {
    chips.push({
      label: c,
      clear: {
        ...base,
        caracteristicas: (query.caracteristicas ?? []).filter((x) => x !== c),
      },
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <button
          key={`${chip.label}-${i}`}
          type="button"
          onClick={() => navigate(chip.clear)}
          className="inline-flex items-center gap-1 rounded-full bg-clay-soft px-3 py-1 text-xs font-medium text-clay"
        >
          {chip.label}
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
      <button
        type="button"
        onClick={() =>
          navigate({ operacion: query.operacion, sort: query.sort })
        }
        className="text-xs font-semibold text-primary underline"
      >
        Limpiar todo
      </button>
    </div>
  );
}
