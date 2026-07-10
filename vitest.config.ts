import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      lettermark: resolve(import.meta.dirname, "packages/lettermark/src/index.ts"),
    },
  },
  test: {
    include: ["packages/**/*.test.{ts,tsx}"],
    environment: "node",
    environmentMatchGlobs: [["packages/**/*.test.tsx", "happy-dom"]],
  },
});
