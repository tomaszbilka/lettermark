import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/**/*.test.{ts,tsx}"],
    environment: "node",
    environmentMatchGlobs: [["packages/**/*.test.tsx", "happy-dom"]],
  },
});
