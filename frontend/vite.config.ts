import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, calls to /api go to the FastAPI server on port 8000.
// This keeps the login cookie on the same origin, so no CORS trouble.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: process.env.VITE_API_PROXY ?? "http://localhost:8000", changeOrigin: true },
    },
  },
});
