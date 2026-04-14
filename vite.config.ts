import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const githubPagesBase = '/tw-population-countdown/'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? githubPagesBase : '/',
  plugins: [react()],
}))
