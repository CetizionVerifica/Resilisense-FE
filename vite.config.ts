/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Serves the MSW service worker in dev only (VITE_API_MOCKS=1 runs, Playwright). It is never in
 * public/, so a production build cannot ship it.
 */
const mockWorker = (): Plugin => ({
  name: 'resilisense:msw-worker',
  apply: 'serve',
  configureServer(server) {
    const file = fileURLToPath(new URL('./node_modules/msw/lib/mockServiceWorker.js', import.meta.url));
    server.middlewares.use('/mockServiceWorker.js', (_req, res) => {
      res.setHeader('content-type', 'text/javascript');
      res.end(readFileSync(file));
    });
  },
});

export default defineConfig(() => ({
  plugins: [react(), tailwindcss(), mockWorker()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 5173,
    // Same-origin in development: the refresh cookie (Path=/v1/auth) works without CORS.
    proxy: { '/v1': { target: process.env.API_PROXY_TARGET ?? 'http://localhost:4000', changeOrigin: true } },
  },
  build: {
    sourcemap: false, // never ship public source maps (CLAUDE.md)
    // Budget (01 §8): initial JS < 250 kB gzip. The raw-size warning is set above today's entry
    // chunk so real regressions stand out; features are lazy routes.
    chunkSizeWarningLimit: 700,
    target: 'es2023',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
    css: false,
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/api/generated/**', 'src/**/*.stories.tsx', 'src/test/**'],
    },
  },
}));
