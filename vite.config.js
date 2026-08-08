import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Site is served from https://cemdrk.github.io/devtoyz/
// so the base path must match the repo name.
export default defineConfig({
  plugins: [vue()],
  base: '/devtoyz/',
})
