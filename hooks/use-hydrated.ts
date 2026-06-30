"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns `false` on the server and during the first (hydration) render, then
 * `true` afterwards.
 *
 * Lets a component defer cache-dependent UI until after hydration, so the server
 * markup and the first client render stay identical even when the
 * localStorage-backed SWR cache already has data.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
