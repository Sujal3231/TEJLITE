import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: ['react', 'react-dom'],
          // UI libraries
          ui: ['framer-motion', 'lucide-react', 'react-icons'],
          // Firebase
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/storage'],
          // Router
          router: ['react-router-dom'],
        },
      },
    },
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
  },
});
