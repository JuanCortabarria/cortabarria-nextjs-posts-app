import type { FetchError } from "@/lib/fetcher";
import type { Post } from "@/lib/types";

import { PostCard } from "./post-card";

interface PostsListProps {
  posts: Post[] | undefined;
  error: FetchError | undefined;
  userId: string;
}

/**
 * Renders the loaded posts, or the appropriate empty / error message when there
 * is nothing to show. The first-load skeleton is handled by the caller.
 */
export function PostsList({ posts, error, userId }: PostsListProps) {
  // No cached data to fall back on: surface the error (retrying is automatic).
  if (!posts) {
    if (!error) {
      return null;
    }
    return (
      <p className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        Something went wrong while loading posts. Retrying…
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No posts found for user ID {userId}.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
