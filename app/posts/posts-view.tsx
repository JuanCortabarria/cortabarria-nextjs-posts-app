"use client";

import { useState } from "react";

import { PostCard } from "@/components/post-card";
import { PostCardSkeleton } from "@/components/post-card-skeleton";
import { SearchInput } from "@/components/search-input";
import { SlowConnectionBanner } from "@/components/slow-connection-banner";
import { useDebounce } from "@/hooks/use-debounce";
import { usePosts } from "@/hooks/use-posts";

const SKELETON_COUNT = 6;

/**
 * Client-side orchestrator for the posts page: search, data fetching, loading
 * and error states, and the list rendering. Kept separate from `page.tsx` so
 * the route entry can stay a Server Component.
 */
export function PostsView() {
  // Raw input value: updates on every keystroke so the field feels responsive.
  const [userIdInput, setUserIdInput] = useState("");
  // Debounced value: this is what feeds the SWR key, so the request only fires
  // once typing settles (debounce-over-the-key pattern).
  const debouncedUserId = useDebounce(userIdInput, 400);

  const { posts, error, isLoading, isValidating } = usePosts(debouncedUserId);

  // First load has no data yet -> show a full skeleton.
  // A revalidation already has data (kept via `keepPreviousData`) -> leave the
  // list in place and show only a subtle indicator.
  const isRevalidating = isValidating && !isLoading;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Posts
        </h1>
        {isRevalidating ? (
          <span className="text-xs text-zinc-400" aria-hidden="true">
            Updating…
          </span>
        ) : null}
      </div>

      <div className="mb-6">
        <SearchInput value={userIdInput} onChange={setUserIdInput} />
      </div>

      <div className="mb-4">
        <SlowConnectionBanner />
      </div>

      {/* Only block the whole view on error when there is nothing cached to show. */}
      {error && !posts ? (
        <p className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Something went wrong while loading posts. Retrying…
        </p>
      ) : null}

      {isLoading ? (
        <ul className="flex flex-col gap-4" aria-hidden="true">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <li key={index}>
              <PostCardSkeleton />
            </li>
          ))}
        </ul>
      ) : null}

      {!isLoading && posts && posts.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No posts found for user ID {debouncedUserId}.
        </p>
      ) : null}

      {!isLoading && posts && posts.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
