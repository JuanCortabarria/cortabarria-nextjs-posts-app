import { PostCardSkeleton } from "./post-card-skeleton";

const SKELETON_COUNT = 6;

/**
 * Full-list placeholder shown during the very first load, before any data (or
 * cache) is available.
 */
export function PostsSkeleton() {
  return (
    <ul className="flex flex-col gap-4" aria-hidden="true">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <li key={index}>
          <PostCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
