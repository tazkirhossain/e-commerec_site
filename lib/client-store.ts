"use client";

import { useSyncExternalStore } from "react";

/**
 * Small external stores for the three things that only exist on the client:
 * persisted state, the scroll position and the clock.
 *
 * All three are read with `useSyncExternalStore` rather than an effect that
 * calls `setState`. That matters for correctness, not just lint: the hook
 * renders the server snapshot during hydration and swaps to the client value
 * in the same commit, so there is no mismatch and no cascading second render.
 */

/* ------------------------------------------------------------- Persisted */

export interface PersistedStore<T> {
  subscribe: (onChange: () => void) => () => void;
  get: () => T;
  getServer: () => T;
  set: (next: T) => void;
}

/**
 * A value mirrored to `localStorage`.
 *
 * The snapshot is cached, because `useSyncExternalStore` requires a
 * referentially stable value between notifications — returning a freshly
 * parsed object each call would loop forever.
 *
 * Storage throws in private mode and can be blocked entirely, so every access
 * is guarded and the fallback is used when it fails.
 */
export function createPersistedStore<T>(
  key: string,
  fallback: T,
): PersistedStore<T> {
  let snapshot: T | undefined;
  const listeners = new Set<() => void>();

  function read(): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  return {
    subscribe(onChange) {
      listeners.add(onChange);
      /* Another tab writing the same key should update this one too. */
      function onStorage(event: StorageEvent) {
        if (event.key !== key) return;
        snapshot = read();
        for (const listener of listeners) listener();
      }
      window.addEventListener("storage", onStorage);

      return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", onStorage);
      };
    },

    get() {
      if (snapshot === undefined) snapshot = read();
      return snapshot;
    },

    getServer() {
      return fallback;
    },

    set(next) {
      snapshot = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* Unavailable — the session still works, it just will not persist. */
      }
      for (const listener of listeners) listener();
    },
  };
}

export function usePersisted<T>(store: PersistedStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}

/* ------------------------------------------------------------- Hydration */

function neverChanges() {
  return () => {};
}

/**
 * False on the server and during hydration, true afterwards.
 *
 * Used to hold back anything that would differ between the two — a cart count
 * read from storage, a badge that depends on it.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

/* ---------------------------------------------------------------- Scroll */

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** Whether the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

/* ----------------------------------------------------------------- Clock */

/**
 * The current time, as milliseconds, refreshed on an interval.
 *
 * Returns 0 on the server and during hydration, which callers read as "not
 * known yet" — the clock is request-time data and must not reach the
 * prerendered HTML.
 */
const timeStores = new Map<
  number,
  { subscribe: (cb: () => void) => () => void; get: () => number }
>();

function timeStore(intervalMs: number) {
  const existing = timeStores.get(intervalMs);
  if (existing) return existing;

  let snapshot = 0;
  const listeners = new Set<() => void>();
  let timer: number | undefined;

  const store = {
    subscribe(onChange: () => void) {
      listeners.add(onChange);

      if (timer === undefined) {
        snapshot = Date.now();
        timer = window.setInterval(() => {
          snapshot = Date.now();
          for (const listener of listeners) listener();
        }, intervalMs);
      }

      return () => {
        listeners.delete(onChange);
        if (listeners.size === 0 && timer !== undefined) {
          window.clearInterval(timer);
          timer = undefined;
        }
      };
    },
    get: () => snapshot,
  };

  timeStores.set(intervalMs, store);
  return store;
}

export function useNow(intervalMs = 60_000): Date | null {
  const store = timeStore(intervalMs);
  const ms = useSyncExternalStore(store.subscribe, store.get, () => 0);
  return ms === 0 ? null : new Date(ms);
}
