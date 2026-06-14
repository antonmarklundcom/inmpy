'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Search,
  Home as HomeIcon,
  Building2,
  Building,
  Trees,
  Briefcase,
  Store,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';
import type { Operacion, Tipo } from '@/lib/types';
import { TIPO_TO_SLUG } from '@/lib/taxonomy';

const TYPE_CHIPS: { value: Tipo | 'todos'; label: string; Icon: typeof HomeIcon }[] = [
  { value: 'todos', label: 'Todos', Icon: LayoutGrid },
  { value: 'casa', label: 'Casa', Icon: HomeIcon },
  { value: 'departamento', label: 'Departamento', Icon: Building2 },
  { value: 'duplex', label: 'Dúplex', Icon: Building },
  { value: 'terreno', label: 'Terreno', Icon: Trees },
  { value: 'oficina', label: 'Oficina', Icon: Briefcase },
  { value: 'local', label: 'Local', Icon: Store },
];

export function HeroSearch() {
  const router = useRouter();
  const [operacion, setOperacion] = useState<Operacion>('venta');
  const [tipo, setTipo] = useState<Tipo | 'todos'>('todos');
  const [ubicacion, setUbicacion] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [dormitorios, setDormitorios] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const base = operacion === 'venta' ? '/comprar' : '/alquilar';
    const path = tipo !== 'todos' ? `${base}/${TIPO_TO_SLUG[tipo]}` : base;
    const params = new URLSearchParams();
    if (ubicacion.trim()) params.set('ubicacion', ubicacion.trim());
    if (precioMin) params.set('precioMin', precioMin);
    if (precioMax) params.set('precioMax', precioMax);
    if (dormitorios) params.set('dormitorios', dormitorios);
    const qs = params.toString();
    router.push(qs ? `${path}?${qs}` : path);
  }

  return (
    <form
      onSubmit={submit}
      className="card mx-auto w-full max-w-3xl p-4 shadow-lift sm:p-6"
    >
      {/* Tabs */}
      <div className="mb-4 inline-flex rounded-control bg-cream p-1">
        {(['venta', 'alquiler'] as Operacion[]).map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setOperacion(op)}
            className={`rounded-[6px] px-5 py-2 text-sm font-semibold transition-colors ${
              operacion === op ? 'bg-white text-primary shadow-sm' : 'text-muted'
            }`}
          >
            {op === 'venta' ? 'Comprar' : 'Alquilar'}
          </button>
        ))}
      </div>

      {/* Location */}
      <label htmlFor="ubicacion" className="sr-only">
        Ubicación
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          id="ubicacion"
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          placeholder="Barrio, ciudad o departamento"
          className="input pl-11"
        />
      </div>

      {/* Type chips */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {TYPE_CHIPS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTipo(value)}
            className={`chip shrink-0 ${tipo === value ? 'chip-active' : ''}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* More filters */}
      <button
        type="button"
        onClick={() => setMoreOpen((v) => !v)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
        aria-expanded={moreOpen}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Más filtros
      </button>

      {moreOpen && (
        <div className="mt-3 grid gap-3 rounded-control bg-cream p-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Precio mín. (US$)
            </label>
            <input
              type="number"
              min={0}
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="input"
              placeholder="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Precio máx. (US$)
            </label>
            <input
              type="number"
              min={0}
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="input"
              placeholder="Sin límite"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Dormitorios (mín.)
            </label>
            <select
              value={dormitorios}
              onChange={(e) => setDormitorios(e.target.value)}
              className="input"
            >
              <option value="">Cualquiera</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>
      )}

      <button type="submit" className="btn-primary mt-5 w-full text-base">
        <Search className="h-5 w-5" />
        Buscar propiedades
      </button>
    </form>
  );
}
