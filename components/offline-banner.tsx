/**
 * Notice shown while the browser is offline, clarifying that the visible posts
 * come from the local cache. Announced politely for assistive technology.
 */
export function OfflineBanner() {
  return (
    <p
      role="status"
      aria-live="polite"
      className="rounded-md bg-zinc-100 px-4 py-2 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
    >
      You&apos;re offline — showing the last saved posts.
    </p>
  );
}
