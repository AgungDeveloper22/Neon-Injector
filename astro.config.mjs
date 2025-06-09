import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],
  site: 'https://AgungDeveloper22.github.io/Neon-Injector',
  base: '/Neon-Injector',
  output: 'static',
  vite: {
    ssr: {
      noExternal: ['@tsparticles/react', '@tsparticles/slim', '@react-three/fiber', '@react-three/drei'],
    },
    build: {
      rollupOptions: {
        external: [],
      },
    },
    optimizeDeps: {
      exclude: ['@tsparticles/slim'],
    },
  },
});