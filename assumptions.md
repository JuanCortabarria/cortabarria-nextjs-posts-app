# Assumptions

Factors presumed while building this app.

## Environment

- Developed on **Node 22.16.0** and **npm 10.9.2** (Node 20+ should work).
- **Next.js 16.2.9** (App Router), **React 19.2.4**, **TypeScript** in `strict`
  mode, **Tailwind CSS v4**, **SWR 2.4**.

## Architecture

- **App Router** (not the Pages Router): it is the current Next.js default and
  provides a first-class Server/Client Component model plus Route Handlers.
- The "backend in TypeScript" requirement is fulfilled by a **Route Handler**
  (`app/api/posts/route.ts`) that proxies and caches JSONPlaceholder, instead of
  calling the third-party API directly from the browser. This gives us a
  same-origin endpoint (no CORS) and a single place to add caching/resilience.

## Data / API

- `https://jsonplaceholder.typicode.com/posts` is assumed **public** (no auth),
  **stable**, and to return a **fixed shape**: `{ userId, id, title, body }`.
- **`userId` is assumed to be a positive integer.** The search input strips
  non-digit characters, and the proxy only forwards `userId` when it matches
  `^\d+$`; otherwise it returns all posts.
- An **empty search input means no filter** → all posts are listed.
- A `userId` with no posts returns an empty list (shown as a "no posts found"
  message).

## Caching

- The proxy caches upstream responses in Next.js's **Data Cache** with
  `revalidate = 60` seconds, keyed by URL (so each `userId` is cached
  independently). 60s is a reasonable balance between freshness and resilience
  for this largely-static demo data; if a background revalidation fails, Next.js
  keeps serving the last good copy.

## Offline support

- Offline support is **intentionally limited** (not a full PWA / service
  worker). The SWR cache is mirrored to `localStorage` (with an SSR guard) so a
  reload shows the last fetched data, and an indicator appears when the browser
  reports it is offline.
- Offline behaviour is **verified manually** in the browser, not in automated
  tests.

## Testing

- Automated tests cover **our own logic** (`fetcher`, `useDebounce`). SWR's
  internal behaviour (reconnection / retry) is trusted and not re-tested.
