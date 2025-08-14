// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy:
      process.env.NODE_ENV === "development"
        ? {
            "/api": {
              target: process.env.VERCEL
                ? "http://localhost:3000"
                : "http://localhost:3001",
              changeOrigin: true,
            },
          }
        : {},
  },
});
