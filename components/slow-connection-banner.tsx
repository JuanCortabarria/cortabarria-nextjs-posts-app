"use client";

import { useSlowConnection } from "@/app/providers";

/**
 * Notifies the user when a request is taking longer than expected.
 *
 * The live region is always mounted (and announced politely) so assistive
 * technology picks up the message the moment it appears; the visible text is
 * what toggles.
 */
export function SlowConnectionBanner() {
  const isSlowConnection = useSlowConnection();

  return (
    <div role="status" aria-live="polite">
      {isSlowConnection ? (
        <p className="rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          This is taking longer than usual — still loading…
        </p>
      ) : null}
    </div>
  );
}
