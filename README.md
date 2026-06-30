# Posts

A small Next.js app that lists posts from
**Live demo:** https://cortabarria-nextjs-posts-app.vercel.app
[JSONPlaceholder](https://jsonplaceholder.typicode.com/posts) and lets you filter
them by `userId`. It is built with **unstable connections in mind**: every
feature aims to keep the app usable when the network is slow or drops.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **SWR** as the single client data layer
- **Vitest** for unit tests

## Getting started

Requires Node 20+ (developed on Node 22.16, npm 10.9).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — `/` redirects to `/posts`.

### Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Production build                     |
| `npm start`     | Serve the production build           |
| `npm run lint`  | Run ESLint                           |
| `npm test`      | Run the unit tests (Vitest)          |

## How it works (key decisions)

- **Backend proxy.** The client never calls JSONPlaceholder directly. It calls a
  same-origin **Route Handler** at `app/api/posts/route.ts`, which proxies the
  upstream and caches it (Next.js Data Cache, `revalidate = 60s`, keyed by URL).
  This satisfies the "backend in TypeScript" requirement, avoids CORS, and makes
  the app resilient to a slow or temporarily unreachable upstream.
- **SWR everywhere.** A single global config (`app/providers.tsx`) sets:
  - `revalidateOnReconnect` + bounded retries (`errorRetryCount` / `Interval`),
    with a custom `onErrorRetry` that **does not retry 4xx** (permanent) but
    does retry transient/network errors.
  - `keepPreviousData` so changing the filter never flashes back to empty.
  - `loadingTimeout` to drive a slow-connection notice.
  - A `localStorage`-backed cache `provider` for offline reloads.
- **The fetcher throws on non-OK responses** (`lib/fetcher.ts`). This is what
  lets SWR's retry/error/reconnect machinery kick in — a fetcher that swallowed
  errors would silently break it.
- **Debounced search over the SWR key** (`app/posts/posts-view.tsx`). The input
  state updates on every keystroke (responsive UI), but the *debounced* value
  builds the SWR key, so the request only fires once typing settles. Empty input
  lists all posts.
- **Differentiated loading states.** A skeleton on the very first load; a subtle
  "Updating…" indicator on background revalidations.
- **Slow-connection banner** (`onLoadingSlow`), accessible via `role="status"` /
  `aria-live="polite"`.
- **Offline persistence + indicator.** The SWR cache is mirrored to
  `localStorage` (with an SSR guard), so a reload while offline still shows the
  last data; an indicator appears when the browser is offline. A hydration guard
  (`useSyncExternalStore`) keeps the server and first client render identical.

## Project structure

```
app/
  layout.tsx              root layout; mounts <Providers>
  providers.tsx           SWRConfig + localStorage cache + slow-connection context
  page.tsx                redirects / -> /posts
  posts/
    page.tsx              Server Component route entry
    posts-view.tsx        Client Component; orchestrates the page
  api/posts/route.ts      backend proxy + cache
components/
  post-card.tsx, post-card-skeleton.tsx, posts-list.tsx,
  posts-skeleton.tsx, search-input.tsx, slow-connection-banner.tsx,
  offline-banner.tsx
hooks/
  use-posts.ts, use-debounce.ts, use-online-status.ts, use-hydrated.ts
lib/
  fetcher.ts, types.ts, local-storage-cache.ts
```

## Testing

- **Unit tests:** `npm test` — the throwing `fetcher` and the `useDebounce`
  timing. We test our own logic and trust SWR's internals.
- **Manual checks:** offline persistence, the slow-connection banner and
  reconnect/retry are verified by hand in the browser DevTools.

See [assumptions.md](./assumptions.md) for the assumptions made.

## Deployment on Vercel

Done from the Vercel dashboard by the repository owner (not automated in this
repo):

1. Create a Vercel account and import the GitHub repo (**Add New… → Project**).
2. Authorize the Vercel app on that repository.
3. Deploy: it then runs automatically on every push to `main` (Production) and on
   every Pull Request targeting `main` (Preview), with no extra configuration.
