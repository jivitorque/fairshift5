import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Determine base path:
// 1. Explicit VITE_BASE_URL / BASE_URL env var (e.g. from GitHub Actions configure-pages)
// 2. Extracted from GITHUB_REPOSITORY (e.g. "username/fairshift" -> "/fairshift/")
// 3. Fallback to './' for local builds / relative hosting
const getBasePath = (): string => {
  const customBase = (process.env.VITE_BASE_URL || process.env.BASE_URL)?.trim()
  if (customBase) {
    return customBase.endsWith('/') ? customBase : `${customBase}/`
  }
  if (process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split('/')[1]?.trim()
    return repo ? `/${repo}/` : './'
  }
  return './'
}

// https://vite.dev/config/
export default defineConfig({
  base: getBasePath(),
  plugins: [
    react(),
    tailwindcss(),
  ],
})
