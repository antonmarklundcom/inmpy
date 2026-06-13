"use client";

import { Heart } from "lucide-react";
import { useSavedListings } from "@/hooks/useSavedListings";

interface Props {
  slug: string;
  className?: string;
  /** Larger variant for the detail page. */
  size?: "sm" | "lg";
}

/** Clay heart save toggle. Persists to localStorage, no backend. */
export function SaveButton({ slug, className = "", size = "sm" }: Props) {
  const { isSaved, toggle, hydrated } = useSavedListings();
  const saved = hydrated && isSaved(slug);

  const dim = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const icon = size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Quitar de guardados" : "Guardar propiedad"}
      title={saved ? "Quitar de guardados" : "Guardar propiedad"}
      className={`flex ${dim} items-center justify-center rounded-full bg-white/95 shadow-soft transition-transform hover:scale-105 ${className}`}
    >
      <Heart
        className={`${icon} transition-colors ${
          saved ? "fill-clay text-clay" : "text-muted"
        }`}
        aria-hidden
      />
    </button>
  );
}
