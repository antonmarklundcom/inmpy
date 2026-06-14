'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Saved listings, persisted in localStorage. No backend in Phase 1.
 *
 * Implemented with a tiny external store so every card/heart on the page stays
 * in sync, and reads are hydration-safe (server snapshot is always empty).
 */

const KEY = 'vivienda:guardados';
const EVENT = 'vivienda:guardados-changed';

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(ids: string[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable — ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    listeners.delete(cb);
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

// Cache the parsed snapshot so useSyncExternalStore gets a stable reference
// between renders (it compares by identity).
let snapshot: string[] = [];
let snapshotRaw = '__init__';

function getSnapshot(): string[] {
  if (typeof window === 'undefined') return EMPTY;
  const raw = window.localStorage.getItem(KEY) ?? '';
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = read();
  }
  return snapshot;
}

const EMPTY: string[] = [];

function getServerSnapshot(): string[] {
  return EMPTY;
}

export function useSavedIds(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useSaved(id: string): {
  saved: boolean;
  toggle: () => void;
} {
  const ids = useSavedIds();
  const saved = ids.includes(id);
  const toggle = useCallback(() => {
    const current = read();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    write(next);
  }, [id]);
  return { saved, toggle };
}

export function useSavedCount(): number {
  const ids = useSavedIds();
  // Avoid hydration mismatch: render 0 until mounted.
  const mounted = useMounted();
  return mounted ? ids.length : 0;
}

function useMounted(): boolean {
  const subscribeMount = useCallback((cb: () => void) => {
    cb();
    return () => {};
  }, []);
  return useSyncExternalStore(
    subscribeMount,
    () => true,
    () => false,
  );
}

export function clearSaved(): void {
  write([]);
}

/** Imperative read for non-hook contexts. */
export function readSavedIds(): string[] {
  return read();
}

export { useMounted };
