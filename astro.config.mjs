import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    sitemap({
      changefreq: 'weekly', // Frekuensi perubahan halaman (opsional: daily, monthly, dll.)
      priority: 0.7, // Prioritas default untuk halaman (0.0 - 1.0)
      lastmod: new Date(), // Tanggal terakhir modifikasi (diperbarui otomatis saat build)
      // Opsi untuk menyesuaikan prioritas per halaman
      customPages: [], // Tambahkan halaman kustom jika ada (misalnya, dynamic routes)
      // Filter untuk mengecualikan halaman tertentu jika diperlukan
      filter: (page) => !page.includes('/404'), // Mengecualikan halaman 404
    }),
  ],
  site: 'https://neoninjector.my.id',
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