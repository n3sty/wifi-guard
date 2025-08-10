import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: import.meta.resolve('src/popup.html'),
        background: import.meta.resolve('src/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    target: 'es2017',
    minify: false, // Keep readable for debugging
  },
  resolve: {
    alias: {
      '@': import.meta.resolve('./src'),
    },
  },
})