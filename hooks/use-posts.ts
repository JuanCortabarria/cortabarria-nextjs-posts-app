"use client";

import useSWR from "swr";

import { FetchError } from "@/lib/fetcher";
import type { Post } from "@/lib/types";

/**
 * Fetches the posts list, optionally filtered by `userId`.
 *
 * The filter is encoded into the SWR key, so a different `userId` transparently
 * triggers a new request and gets its own cache entry. An empty `userId` lists
 * every post. The caller is expected to pass an already-debounced value.
 */
export function usePosts(userId: string) {
  const key = userId ? `/api/posts?userId=${userId}` : "/api/posts";

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    Post[],
    FetchError
  >(key);

  return {
    posts: data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
