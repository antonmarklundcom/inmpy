"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vivienda:saved";
const EVENT = "vivienda:saved-changed";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeSaved(slugs: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* storage might be unavailable (private mode); fail silently */
  }
}

/**
 * Saved-listings state backed by localStorage. Hydration-safe: starts empty on
 * the server and first client render, then syncs after mount. Changes broadcast
 * via a custom event so the header count and cards stay in sync.
 */
export function useSavedListings() {
  const [saved, setSaved] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(readSaved());
    setHydrated(true);

    const sync = () => setSaved(readSaved());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback(
    (slug: string) => saved.includes(slug),
    [saved]
  );

  const toggle = useCallback((slug: string) => {
    const current = readSaved();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    writeSaved(next);
    setSaved(next);
  }, []);

  return { saved, isSaved, toggle, hydrated, count: saved.length };
}
