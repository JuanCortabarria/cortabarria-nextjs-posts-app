import type { Cache } from "swr";

const CACHE_STORAGE_KEY = "posts-cache";

/**
 * SWR cache provider backed by localStorage, so data survives a page reload —
 * even while offline.
 *
 * The SSR guard is essential: `localStorage` doesn't exist on the server, so we
 * return an empty in-memory cache there. On the client we hydrate from
 * localStorage and write the whole cache back on `beforeunload`.
 */
export function localStorageProvider(): Cache {
  if (typeof window === "undefined") {
    return new Map();
  }

  const persisted = localStorage.getItem(CACHE_STORAGE_KEY);
  const entries = persisted ? (JSON.parse(persisted) as [string, unknown][]) : [];
  const cache = new Map<string, unknown>(entries);

  window.addEventListener("beforeunload", () => {
    localStorage.setItem(
      CACHE_STORAGE_KEY,
      JSON.stringify(Array.from(cache.entries())),
    );
  });

  return cache as unknown as Cache;
}
