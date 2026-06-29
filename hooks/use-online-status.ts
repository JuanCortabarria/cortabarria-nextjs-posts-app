"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/**
 * Tracks the browser's online/offline state via `useSyncExternalStore`.
 *
 * The server snapshot assumes "online" so the server render and the first
 * client (hydration) render agree; the real value comes from `navigator.onLine`
 * and stays in sync through the `online`/`offline` events.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
