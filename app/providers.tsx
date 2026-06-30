"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SWRConfig, type SWRConfiguration } from "swr";

import { FetchError, fetcher } from "@/lib/fetcher";
import { localStorageProvider } from "@/lib/local-storage-cache";

// Bounded retry policy for failed requests.
const ERROR_RETRY_INTERVAL_MS = 5000;
const ERROR_RETRY_COUNT = 5;
// A request slower than this fires `onLoadingSlow` (the slow-connection notice).
const SLOW_REQUEST_THRESHOLD_MS = 3000;

function isClientError(error: unknown): boolean {
  return (
    error instanceof FetchError && error.status >= 400 && error.status < 500
  );
}

/**
 * Retry transient / network failures with a bounded, fixed-interval backoff, but
 * never retry client errors (4xx) — those won't fix themselves. Reconnection is
 * handled separately by `revalidateOnReconnect`.
 */
const onErrorRetry: SWRConfiguration["onErrorRetry"] = (
  error,
  _key,
  config,
  revalidate,
  { retryCount },
) => {
  if (isClientError(error)) {
    return;
  }
  if (retryCount >= (config.errorRetryCount ?? ERROR_RETRY_COUNT)) {
    return;
  }
  setTimeout(
    () => revalidate({ retryCount }),
    config.errorRetryInterval ?? ERROR_RETRY_INTERVAL_MS,
  );
};

/**
 * Whether the current request is taking longer than expected. Driven by the
 * `onLoadingSlow` / `onSuccess` / `onError` callbacks below and consumed by the
 * slow-connection banner.
 */
const SlowConnectionContext = createContext(false);

export function useSlowConnection(): boolean {
  return useContext(SlowConnectionContext);
}

/**
 * Global SWR configuration plus the slow-connection context, mounted once at the
 * root. Centralising these options means every `useSWR` call inherits the same
 * network-resilience behaviour without repeating it.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  return (
    <SWRConfig
      value={{
        fetcher,
        // Persist the cache to localStorage for offline reloads.
        provider: localStorageProvider,
        // Re-run requests automatically once connectivity is regained.
        revalidateOnReconnect: true,
        // Retry after a failed request (transient / network errors).
        shouldRetryOnError: true,
        errorRetryInterval: ERROR_RETRY_INTERVAL_MS,
        errorRetryCount: ERROR_RETRY_COUNT,
        loadingTimeout: SLOW_REQUEST_THRESHOLD_MS,
        // When the key changes (e.g. applying a filter) keep showing the
        // previous data instead of flashing back to an empty/loading state.
        keepPreviousData: true,
        // Slow-connection notice: show while a request drags on, hide as soon
        // as it settles (either way).
        onLoadingSlow: () => setIsSlowConnection(true),
        onSuccess: () => setIsSlowConnection(false),
        onError: () => setIsSlowConnection(false),
        onErrorRetry,
      }}
    >
      <SlowConnectionContext.Provider value={isSlowConnection}>
        {children}
      </SlowConnectionContext.Provider>
    </SWRConfig>
  );
}
