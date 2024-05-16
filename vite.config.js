// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'electron-main',
    outDir: 'dist/test',
    emptyOutDir: true,
    asar: false // Nonaktifkan opsi asar
  }
});
