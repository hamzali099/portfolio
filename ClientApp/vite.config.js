import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds into the ASP.NET Core wwwroot with stable file names,
// so Views/Shared/_Layout.cshtml can reference them directly.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../Portfolio.Web/wwwroot/app',
    emptyOutDir: true,
    manifest: false,
    rollupOptions: {
      input: 'src/main.jsx',
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (info) =>
          info.name && info.name.endsWith('.css') ? 'assets/app.css' : 'assets/[name][extname]',
      },
    },
  },
  server: {
    port: 5173,
    // Forward API calls to the ASP.NET Core app during development
    proxy: {
      '/api': { target: 'https://localhost:7001', changeOrigin: true, secure: false },
    },
  },
});
