/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "./build/dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        calculator: path.resolve(__dirname, "calculator.html"),
        recommendations: path.resolve(__dirname, "recommendations.html"),
        species: path.resolve(__dirname, "species.html"),
      },
    },
  },
  test: {
    watch: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@@": path.resolve(__dirname),
    },
  },
});
