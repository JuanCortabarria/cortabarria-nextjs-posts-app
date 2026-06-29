/**
 * Error thrown by {@link fetcher} when the response status is not OK.
 *
 * Carrying the HTTP `status` lets SWR's `onErrorRetry` decide whether to retry:
 * client errors (4xx) are permanent and should not be retried, while transient
 * failures (5xx / network) should.
 */
export class FetchError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

/**
 * Typed fetcher for SWR.
 *
 * IMPORTANT: it MUST throw on a non-OK response. SWR treats a resolved promise
 * as a success and will neither retry nor enter its error state, so swallowing
 * `!res.ok` here would silently break reconnection/retry behaviour.
 */
export async function fetcher<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    throw new FetchError(res.status, `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}
