import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  server: {
    origin: 'http://localhost:5173',

  },
  plugins: [react()],
  resolve: {
    alias: {
      '@tailwindConfig': path.resolve(__dirname, 'tailwind.config.js'),
    },
  },
  optimizeDeps: {
    include: [
      '@tailwindConfig',
    ]
  }, 
  base: "/static/",
  build: {
    manifest: "manifest.json",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: path.resolve('./src/main.jsx'),
      },
      output: {
        dir: '../staticfiles/vendor',
        entryFileNames: '[name].js',
      },
    } 
  }

})
