import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const githubPagesRepoName = 'tw-population-counter'
const githubPagesBase = `/${githubPagesRepoName}/`

export default defineConfig(({ command }) => ({
  base: command === 'build' ? githubPagesBase : '/',
  plugins: [react()],
}))
