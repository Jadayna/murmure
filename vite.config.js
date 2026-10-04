import { defineConfig } from 'vite';

export default defineConfig({
  // Base '/' par défaut (Vercel). Pour un sous-chemin (ex. axecstudio.com/whitemurmure/app/) :
  // WM_BASE=/whitemurmure/app/ npm run build
  base: process.env.WM_BASE || '/',
  build: {
    target: 'es2020',
    outDir: 'dist',
  },
});
