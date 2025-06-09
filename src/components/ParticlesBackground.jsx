import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
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
  }, []);

  const options = useMemo(
    () => ({
      background: { color: { value: isDark ? '#f5f5f5' : '#0f0824' } },
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: '#8b5cf6' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        links: {
          enable: true,
          distance: 150,
          color: '#a78bfa',
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'connect' },
          onClick: { enable: true, mode: 'push' },
        },
        modes: {
          connect: { distance: 200, links: { opacity: 0.6 } },
          push: { quantity: 4 },
        },
      },
    }),
    [isDark]
  );

  return <Particles id="tsparticles" options={options} />;
}