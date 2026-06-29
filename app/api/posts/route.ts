import { type NextRequest } from "next/server";

import type { Post } from "@/lib/types";

const UPSTREAM_URL = "https://jsonplaceholder.typicode.com/posts";

/**
 * How long (in seconds) a cached upstream response is served before Next.js
 * revalidates it in the background. Keeps the proxy resilient to a slow or
 * temporarily unreachable upstream: within this window we answer from cache,
 * and on a failed revalidation Next keeps serving the last good copy.
 */
const REVALIDATE_SECONDS = 60;

/**
 * Backend proxy for the posts listing.
 *
 * Reads an optional `userId` query param, forwards it to JSONPlaceholder when
 * it is a positive integer, and returns the posts as JSON. The client talks to
 * this same-origin route instead of the third-party API directly.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const userId = request.nextUrl.searchParams.get("userId");
  const hasValidUserId = userId !== null && /^\d+$/.test(userId);

  const upstreamUrl = hasValidUserId
    ? `${UPSTREAM_URL}?userId=${userId}`
    : UPSTREAM_URL;

  const upstreamResponse = await fetch(upstreamUrl, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!upstreamResponse.ok) {
    return Response.json(
      { error: `Upstream request failed with status ${upstreamResponse.status}` },
      { status: 502 },
    );
  }

  const posts = (await upstreamResponse.json()) as Post[];

  return Response.json(posts);
}
