/**
 * Placeholder shown in place of a {@link PostCard} during the very first load,
 * before any data (or cache) is available.
 */
export function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-3 w-8 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="mb-3 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
