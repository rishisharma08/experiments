import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  base: "/experiments/",
  plugins: [
    svgr(),
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "src": path.resolve(__dirname, './src'),
      "demos": path.resolve(__dirname, './src/components/demos'),
    }
  }
})
