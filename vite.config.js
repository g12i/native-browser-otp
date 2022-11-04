// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "lib/index.ts",
      name: "Ticker",
      fileName: (format) => `native-browser-otp.${format}.js`,
    },
    rollupOptions: {
      external: ["base32-decode"],
      output: {
        globals: {
          "base32-decode": "base32_decode",
        },
      },
    },
  },
});
