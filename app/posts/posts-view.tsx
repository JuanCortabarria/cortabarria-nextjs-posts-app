"use client";

import { PostCard } from "@/components/post-card";
import { usePosts } from "@/hooks/use-posts";

/**
 * Client-side orchestrator for the posts page: data fetching, loading and error
 * states, and the list rendering. Kept separate from `page.tsx` so the route
 * entry can stay a Server Component.
 */
export function PostsView() {
  const { posts, error, isLoading } = usePosts("");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Posts
      </h1>

      {error ? (
        <p className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Something went wrong while loading posts. Retrying…
        </p>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading posts…</p>
      ) : null}

      {posts ? (
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
