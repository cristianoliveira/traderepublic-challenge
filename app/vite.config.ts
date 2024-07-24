import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
// @ts-ignore vite-plugin-eslint doesn't export types
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), eslint()],
})
