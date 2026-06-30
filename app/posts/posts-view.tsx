"use client";

import { useState } from "react";

import { OfflineBanner } from "@/components/offline-banner";
import { PostsList } from "@/components/posts-list";
import { PostsSkeleton } from "@/components/posts-skeleton";
import { SearchInput } from "@/components/search-input";
import { SlowConnectionBanner } from "@/components/slow-connection-banner";
import { useDebounce } from "@/hooks/use-debounce";
import { useHydrated } from "@/hooks/use-hydrated";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { usePosts } from "@/hooks/use-posts";

const SEARCH_DEBOUNCE_MS = 400;

/**
 * Client-side orchestrator for the posts page: search, data fetching, and the
 * loading / offline / list states. Kept separate from `page.tsx` so the route
 * entry can stay a Server Component.
 */
export function PostsView() {
  // The input updates on every keystroke (responsive), but the debounced value
  // is what feeds the SWR key, so the request only fires once typing settles.
  const [userIdInput, setUserIdInput] = useState("");
  const userIdFilter = useDebounce(userIdInput, SEARCH_DEBOUNCE_MS);

  const { posts, error, isLoading, isValidating } = usePosts(userIdFilter);
  const isHydrated = useHydrated();
  const isOnline = useOnlineStatus();

  // Show the skeleton on the first load (and until hydration, to avoid a
  // mismatch with the cache). On later revalidations we keep the list in place
  // (via `keepPreviousData`) and show only a subtle indicator.
  const showSkeleton = !isHydrated || isLoading;
  const isRevalidating = isHydrated && isValidating && !isLoading;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Posts
          </h1>
          {isRevalidating ? (
            <span className="text-xs text-zinc-400" aria-hidden="true">
              Updating…
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Posts from the JSONPlaceholder demo API
        </p>
      </header>

      <div className="mb-6">
        <SearchInput value={userIdInput} onChange={setUserIdInput} />
      </div>

      {isHydrated && !isOnline ? (
        <div className="mb-4">
          <OfflineBanner />
        </div>
      ) : null}

      <div className="mb-4">
        <SlowConnectionBanner />
      </div>

      {showSkeleton ? (
        <PostsSkeleton />
      ) : (
        <PostsList posts={posts} error={error} userId={userIdFilter} />
      )}
    </main>
  );
}
