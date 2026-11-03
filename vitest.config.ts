import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
    }),
    Components({
      dirs: ["./components"],
      directoryAsNamespace: true,
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    // 建置輸出測試要先 generate，只在 test:site 跑
    include: process.env.SITE ? ["tests/site.spec.ts"] : ["**/*.spec.ts"],
    exclude: ["node_modules/**", ...(process.env.SITE ? [] : ["tests/site.spec.ts"])],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
