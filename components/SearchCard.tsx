"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Home as HomeIcon,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  Store,
  Trees,
  Building,
  MapPin,
} from "lucide-react";
import type { Tipo } from "@/lib/listings-schema";

const TYPE_CHIPS: { value: Tipo | "todos"; label: string; Icon: typeof HomeIcon }[] =
  [
    { value: "todos", label: "Todos", Icon: LayoutGrid },
    { value: "casa", label: "Casa", Icon: HomeIcon },
    { value: "departamento", label: "Departamento", Icon: Building2 },
    { value: "duplex", label: "Dúplex", Icon: Building },
    { value: "terreno", label: "Terreno", Icon: Trees },
    { value: "oficina", label: "Oficina", Icon: Building2 },
    { value: "local", label: "Local", Icon: Store },
  ];

export function SearchCard() {
  const router = useRouter();
  const [operacion, setOperacion] = useState<"venta" | "alquiler">("venta");
  const [tipo, setTipo] = useState<Tipo | "todos">("todos");
  const [lugar, setLugar] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [dormitorios, setDormitorios] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const base = operacion === "venta" ? "/comprar" : "/alquilar";
    const sp = new URLSearchParams();
    if (tipo !== "todos") sp.set("tipo", tipo);
    if (lugar.trim()) sp.set("lugar", lugar.trim());
    if (precioMin) sp.set("precioMin", precioMin);
    if (precioMax) sp.set("precioMax", precioMax);
    if (dormitorios) sp.set("dormitorios", dormitorios);
    const qs = sp.toString();
    router.push(qs ? `${base}?${qs}` : base);
  }

  return (
    <form
      onSubmit={submit}
      className="w-full rounded-2xl bg-white p-4 shadow-float sm:p-6"
    >
      {/* Operación tabs */}
      <div className="mb-4 inline-flex rounded-control bg-cream p-1">
        {(["venta", "alquiler"] as const).map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setOperacion(op)}
            className={`rounded-[6px] px-5 py-2 text-sm font-medium transition-colors ${
              operacion === op
                ? "bg-white text-primary shadow-soft"
                : "text-muted hover:text-text"
            }`}
            aria-pressed={operacion === op}
          >
            {op === "venta" ? "Comprar" : "Alquilar"}
          </button>
        ))}
      </div>

      {/* Ubicación */}
      <label className="mb-3 block">
        <span className="sr-only">Ubicación</span>
        <span className="relative block">
          <MapPin
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="text"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            placeholder="Barrio, ciudad o departamento"
            className="input pl-10"
          />
        </span>
      </label>

      {/* Tipo chips */}
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
        {TYPE_CHIPS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTipo(value)}
            className={`chip shrink-0 ${tipo === value ? "chip-active" : ""}`}
            aria-pressed={tipo === value}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {/* Más filtros */}
      <button
        type="button"
        onClick={() => setShowMore((s) => !s)}
        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
        aria-expanded={showMore}
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        Más filtros
      </button>

      {showMore && (
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">
              Precio mín. (US$)
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              placeholder="0"
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">
              Precio máx. (US$)
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              placeholder="Sin límite"
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">
              Dormitorios (mín.)
            </span>
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
          </label>
        </div>
      )}

      <button type="submit" className="btn-primary w-full text-base">
        <Search className="h-5 w-5" aria-hidden />
        Buscar propiedades
      </button>
    </form>
  );
}
