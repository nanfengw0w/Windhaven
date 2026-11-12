import { defineConfig, loadEnv } from "vite";
export default defineConfig(({ mode }) => {
  const { PORT } = loadEnv(mode, process.cwd(), "PORT");
  const proxy = {
    "/api": {
      target: "http://127.0.0.1:" + (PORT || 4192),
      changeOrigin: false,
    },
  };
  return {
    base: "./",
    server: { port: 4190, strictPort: true, proxy },
    preview: { port: 4191, strictPort: true, proxy },
    build: { target: "es2022", sourcemap: true, chunkSizeWarningLimit: 1500 },
  };
});
