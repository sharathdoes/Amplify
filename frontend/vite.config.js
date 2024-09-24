import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor code into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Add more conditions here if needed
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Set the limit to 1 MB (adjust as needed)
  },
});
