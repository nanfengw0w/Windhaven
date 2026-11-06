import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  server: { port: 4190, strictPort: true },
  preview: { port: 4191, strictPort: true },
  build: { target: "es2022", sourcemap: true, chunkSizeWarningLimit: 1500 },
});
