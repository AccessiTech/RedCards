import { defineConfig, coverageConfigDefaults } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from 'path';

export default defineConfig(() => {
  return {
    plugins: [react()],
    test: {
      global: true,
      environment: "jsdom",
      setupFiles: ['./src/test-setup.js'],
      testMatch: [
        "**/*.test.js",
        "**/*.test.jsx",
        // "**/*.test.ts",
        // "**/*.test.tsx",
      ],
      coverage: {
        exclude: [ "**/index.jsx", "**/Root/Root.jsx", ...coverageConfigDefaults.exclude ],
        thresholds: {
          lines: 85,
          functions: 85,
          branches: 85,
          statements: 85,
        },
      }
    },
    resolve: {
      alias: {
        'virtual:pwa-register': path.resolve(__dirname, 'src/__mocks__/pwa-register.js'),
      },
    },
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: `@import "./src/scss/variables.scss";`,
      },
    },
  };
});