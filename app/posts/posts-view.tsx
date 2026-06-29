"use client";

import { useState } from "react";

import { PostCard } from "@/components/post-card";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { usePosts } from "@/hooks/use-posts";

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

  const { posts, error, isLoading } = usePosts(debouncedUserId);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Posts
      </h1>

      <div className="mb-6">
        <SearchInput value={userIdInput} onChange={setUserIdInput} />
      </div>

      {error ? (
        <p className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Something went wrong while loading posts. Retrying…
        </p>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading posts…</p>
      ) : null}

      {posts && posts.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No posts found for user ID {debouncedUserId}.
        </p>
      ) : null}

      {posts && posts.length > 0 ? (
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
