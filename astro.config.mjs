import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],
  site: 'https://AgungDeveloper22.github.io/Neon-Injector',
  base: '/',
  output: 'static',
  vite: {
    ssr: {
      noExternal: ['@tsparticles/react', '@tsparticles/slim'],
    },
    optimizeDeps: {
      exclude: ['@tsparticles/slim'],
    },
  },
});