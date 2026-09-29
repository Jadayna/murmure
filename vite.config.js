import { defineConfig } from 'vite';

export default defineConfig({
  // Base '/' : déploiement standard (Vercel, domaine custom, etc.)
  base: '/',
  build: {
    target: 'es2020',
    outDir: 'dist',
  },
});
