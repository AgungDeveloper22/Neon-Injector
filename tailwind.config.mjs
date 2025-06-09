export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neon-purple': '#8b5cf6',
        'neon-purple-light': '#a78bfa',
        'neon-purple-dark': '#6d28d9',
        'neon-glow': '#c4b5fd',
        'dark-bg': '#0f0824',
        'light-bg': '#f5f5f5',
        'dark-text': '#e5e7eb',
        'light-text': '#1f2937',
      },
      boxShadow: {
        'neon-glow': '0 0 8px rgba(139, 92, 246, 0.5), 0 0 16px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
};