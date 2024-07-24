import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  plugins: [preact()],
});
