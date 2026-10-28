"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A small per-visitor preference (e.g. a list's view mode) kept in
 * localStorage, so it survives reloads and visits. Falls back to an
 * in-memory value when storage is unavailable (private mode, blocked
 * site data), so the choice still works for the current page.
 * useSyncExternalStore renders `fallback` on the server and during
 * hydration, then switches to the stored value — no mismatch.
 */
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function useStoredChoice<T extends string>(
  key: string,
  fallback: T,
  allowed: readonly T[]
): [T, (value: T) => void] {
  const stored = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  );
  const value = allowed.includes(stored as T) ? (stored as T) : fallback;

  const setValue = useCallback(
    (next: T) => {
      memory.set(key, next);
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // Storage unavailable — the in-memory value still applies.
      }
      listeners.forEach((listener) => listener());
    },
    [key]
  );

  return [value, setValue];
}
