import { afterEach, describe, expect, it, vi } from "vitest";

import { FetchError, fetcher } from "@/lib/fetcher";

function stubFetch(value: unknown, init: { ok: boolean; status?: number }) {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        ({
          ok: init.ok,
          status: init.status ?? (init.ok ? 200 : 500),
          json: async () => value,
        }) as unknown as Response,
    ),
  );
}

describe("fetcher", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed JSON on an OK response", async () => {
    const data = [{ userId: 1, id: 1, title: "title", body: "body" }];
    stubFetch(data, { ok: true });

    await expect(fetcher("/api/posts")).resolves.toEqual(data);
  });

  it("throws a FetchError on a non-OK response", async () => {
    stubFetch({}, { ok: false, status: 502 });

    await expect(fetcher("/api/posts")).rejects.toBeInstanceOf(FetchError);
  });

  it("carries the HTTP status on the thrown error", async () => {
    stubFetch({}, { ok: false, status: 404 });

    await expect(fetcher("/api/posts")).rejects.toMatchObject({ status: 404 });
  });
});
