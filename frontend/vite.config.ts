import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // This makes the server accessible from outside the container
    host: '0.0.0.0',
    port: 5173,
    // The proxy configuration
    proxy: {
      // Any request starting with /api will be forwarded
      '/api': {
        // The target is the name of our backend service in docker-compose.yml
        target: 'http://backend:8000',
        // This is necessary for the proxy to work correctly
        changeOrigin: true,
      },
    },
  },
})
