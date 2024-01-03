import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    electron({
      main: {
        entry: 'electron/main.js',
      },
      preload: {
        entry: 'electron/preload.js',
      }
    }),
  ],
  build: {
    target: 'esnext',
  }
})
