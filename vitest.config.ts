import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    // jsdom gives us `window`/`document` for testing the React hook.
    environment: "jsdom",
  },
  resolve: {
    // Mirror the `@/*` path alias from tsconfig.json so tests can use it too.
    alias: {
      "@": rootDir,
    },
  },
});
