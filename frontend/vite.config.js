import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local (non-docker) dev: `npm run dev` proxies /api to the backend on :5000.
// In docker-compose, nginx.conf does this proxying instead.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
