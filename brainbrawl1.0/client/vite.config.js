import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Change back to Vite's default 'dist'
    assetsDir: 'assets'
  }
})
