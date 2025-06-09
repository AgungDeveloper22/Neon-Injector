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
      noExternal: ['@tsparticles/react', '@tsparticles/slim', 'sweetalert2'],
    },
    build: {
      rollupOptions: {
        external: [],
      },
    },
    optimizeDeps: {
      exclude: ['@tsparticles'],
    },
  },
});
```

**Changes**:
- **Base**: Removed trailing slash from `base: '/Neon-Injector/'` to `/Neon-Injector` for correct asset paths in GitHub Pages.
- **Vite Config**: Added `vite` settings to handle `@tsparticles` and `sweetalert2`:
  - `ssr.noExternal`: Ensures these modules are bundled to avoid SSR issues during builds.
  - `optimizeDeps.exclude`: Prevents Vite from pre-bundling `@tsparticles`, which can resolve previous resolution errors.
  - `build.rollupOptions.external`: Kept empty to avoid externalizing dependencies.
- **Integrations**: Verified `react()`, `tailwind()`, and `sitemap()` for compatibility.

**Action**:
- Replace your `astro.config.mjs` with the above.
- Save and commit:
  ```bash
  git add astro.config.mjs
  git commit -m "Update Astro config for Vite compatibility and base path"
  ```

#### 3. Verify `src/utils.js`
To prevent errors like the previous `formatDate` and `formatNumber` issues, ensure `src/utils.js` includes all exports for `CommentsSection.jsx` and `HeroSection.jsx`:

<xaiArtifact artifact_id="bae2e129-c615-45ae-bed8-4669a732ef0c" artifact_version_id="555160de-336b-4671-8976-23875977d5a8" title="src/utils.js" contentType="text/javascript">
export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(number);
}

export async function getClientInfo() {
  const userAgent = navigator.userAgent;
  return { userAgent };
}

export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white text-sm transition-opacity duration-300 opacity-100 ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    }`;
    setTimeout(() => {
      toast.className = 'fixed bottom-4 right-4 hidden p-4 rounded-lg shadow-lg text-white text-sm transition-opacity duration-300 opacity-0';
    }, 3000);
  }
}

export async function generateIdentifier(ip, userAgent) {
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(ip + userAgent)
  );
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
```

**Action**:
- Verify `src/utils.js` matches the above.
- If correct, no changes are needed. If not, update and commit:
  ```bash
  git add src/utils.js
  git commit -m "Ensure all utils exports for CommentsSection and HeroSection"
  ```

#### 4. Optimize `ParticlesBackground.jsx`
You requested more prominent particles and connections in `ParticlesBackground.jsx`. Below is the updated version with increased particle size, more connections, and performance optimizations:

<xaiArtifact artifact_id="8bda4272-fecf-489a-b082-2e5511111f36" artifact_version_id="21f553c2-fe71-4f68-8318-205d74006c6f" title="src/components/ParticlesBackground.jsx" contentType="text/jsx">
import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground() {
  const [isDark, setIsDark] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('#particlesBackground');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(initialDark);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [isVisible]);

  const options = useMemo(
    () => ({
      background: { color: { value: isDark ? '#f5f5f5' : '#0f0824' } },
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } }, // More particles
        color: { value: '#8b5cf6' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 5, random: true, anim: { enable: false } }, // Larger particles
        links: {
          enable: true,
          distance: 250, // More connections
          color: '#a78bfa',
          opacity: 0.4,
          width: 1.5, // Thicker lines
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: 'none',
          random: false,
          straight: false,
          outModes: { default: 'out' },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
      performance: {
        fpsLimit: 30,
        detectRetina: false,
      },
    }),
    [isDark, isVisible]
  );

  if (!isVisible) {
    return <div id="particlesBackground" className="absolute inset-0" />;
  }

  return <Particles id="tsparticles" options={options} />;
}
```

**Changes**:
- **Particles**: Increased `number.value` to 80 for more particles and connections.
- **Size**: Set `size.value` to 5 for larger particles.
- **Links**: Increased `links.distance` to 250 and `links.width` to 1.5 for more prominent connections.
- **Performance**: Kept `fpsLimit: 30` and `detectRetina: false` for efficiency.
- **Intersection Observer**: Retained for lazy loading.

**Action**:
- Replace `src/components/ParticlesBackground.jsx` with the above.
- Commit:
  ```bash
  git add src/components/ParticlesBackground.jsx
  git commit -m "Optimize ParticlesBackground with more particles and connections"
  ```

#### 5. Update GitHub Actions Workflow
Align the GitHub Actions workflow with the `gh-pages` deployment script in `package.json`:

<xaiArtifact artifact_id="1b5672e2-c817-4c6b-8a52-3a17eb02cdf2" artifact_version_id="91bd48ea-ee43-4338-9216-412cb3860cee" title=".github/workflows/deploy.yml" contentType="text/yaml">
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install Dependencies
        run: npm ci
      - name: Fix Audit Issues
        run: npm audit fix
      - name: Build Astro
        run: npm run build
      - name: Deploy to GitHub Pages
        if: github.event_name == 'push'
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist