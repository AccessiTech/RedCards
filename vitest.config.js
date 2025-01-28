import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(() => {
  return {
    plugins: [react()],
    test: {
      global: true,
      environment: "jsdom",
      testMatch: [
        "**/*.test.js",
        "**/*.test.jsx",
        // "**/*.test.ts",
        // "**/*.test.tsx",
      ],
    },
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: `@import "./src/scss/variables.scss";`,
      },
    },
  };
});