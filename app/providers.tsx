"use client";

import type { ReactNode } from "react";
import { SWRConfig } from "swr";

import { FetchError, fetcher } from "@/lib/fetcher";

/**
 * Global SWR configuration, mounted once at the root.
 *
 * Centralising these options here means every `useSWR` call in the app inherits
 * the same network-resilience behaviour without repeating it.
 */
export function Providers({ children }: { children: ReactNode }) {
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
        // Threshold (ms) after which `onLoadingSlow` fires. The handler that
        // surfaces a "slow connection" notice is wired up in a later step.
        loadingTimeout: 3000,
        // When the key changes (e.g. applying a filter) keep showing the
        // previous data instead of flashing back to an empty/loading state.
        keepPreviousData: true,
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
      {children}
    </SWRConfig>
  );
}
