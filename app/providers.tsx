"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SWRConfig } from "swr";

import { FetchError, fetcher } from "@/lib/fetcher";

/**
 * Whether the current request is taking longer than expected. Driven by SWR's
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
        // Re-run requests automatically once connectivity is regained.
        revalidateOnReconnect: true,
        // Retry after a failed request (transient / network errors).
        shouldRetryOnError: true,
        errorRetryInterval: 5000,
        errorRetryCount: 5,
        // If a request takes longer than this (ms), `onLoadingSlow` fires.
        loadingTimeout: 3000,
        // When the key changes (e.g. applying a filter) keep showing the
        // previous data instead of flashing back to an empty/loading state.
        keepPreviousData: true,
        // Slow-connection notice: show while a request drags on, hide as soon
        // as it settles (either way).
        onLoadingSlow: () => setIsSlowConnection(true),
        onSuccess: () => setIsSlowConnection(false),
        onError: () => setIsSlowConnection(false),
        onErrorRetry: (error, _key, config, revalidate, { retryCount }) => {
          // Client errors (4xx) are permanent — retrying won't help.
          if (
            error instanceof FetchError &&
            error.status >= 400 &&
            error.status < 500
          ) {
            return;
          }
          // Respect the configured retry ceiling.
          if (retryCount >= (config.errorRetryCount ?? 5)) {
            return;
          }
          // Retry after the configured interval. Reconnection is handled
          // separately by `revalidateOnReconnect`.
          setTimeout(
            () => revalidate({ retryCount }),
            config.errorRetryInterval ?? 5000,
          );
        },
      }}
    >
      <SlowConnectionContext.Provider value={isSlowConnection}>
        {children}
      </SlowConnectionContext.Provider>
    </SWRConfig>
  );
}
