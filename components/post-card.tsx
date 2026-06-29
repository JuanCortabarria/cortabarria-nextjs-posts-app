import type { Post } from "@/lib/types";

/**
 * Presentational card for a single post. Pure markup, no interactivity.
 */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-lg border border-black/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <span>User {post.userId}</span>
        <span>#{post.id}</span>
      </div>
      <h2 className="mb-1 font-semibold capitalize text-zinc-900 dark:text-zinc-50">
        {post.title}
      </h2>
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {post.body}
      </p>
    </article>
  );
}
