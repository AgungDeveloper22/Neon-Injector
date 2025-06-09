import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],
  site: 'https://neon-injector.my.id', // Ganti dengan domain resmi
  output: 'static', // Aktifkan mode SSG
});