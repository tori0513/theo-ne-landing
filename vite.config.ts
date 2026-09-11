import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      // One source of truth for outbound URLs: the build script and the app
      // read the same constants, so they cannot drift apart.
      '@site': path.resolve(import.meta.dirname, './scripts/site.mjs'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
