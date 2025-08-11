import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground() {
  const [isDark, setIsDark] = useState(false);
  const [init, setInit] = useState(false); // State untuk melacak inisialisasi engine
  const [isVisible, setIsVisible] = useState(false);

  // Inisialisasi Particles Engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      setInit(true); // Tandai inisialisasi selesai
    }).catch((error) => {
      console.error('Failed to initialize particles engine:', error);
    });
  }, []);

  // IntersectionObserver untuk lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const section = document.querySelector('#particlesBackground');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Deteksi tema gelap
  useEffect(() => {
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
      background: { color: { value: 'transparent' } },
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: isDark ? '#a855f7' : '#4b0082' }, // Warna berbeda untuk tema terang/gelap
        shape: { type: 'circle' },
        opacity: { value: 0.4, random: true },
        size: { value: 3, random: true },
        links: {
          enable: true,
          distance: 120,
          color: isDark ? '#c084fc' : '#800080',
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.5,
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
        detectRetina: true,
      },
    }),
    [isDark] // Dependensi hanya pada isDark
  );

  if (!isVisible || !init) {
    return (
      <div
        id="particlesBackground"
        className="absolute inset-0 pointer-events-none z-0"
        role="presentation"
        style={{ minHeight: '100vh' }} // Pastikan elemen memiliki tinggi
      />
    );
  }

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ minHeight: '100vh' }} // Pastikan elemen memiliki tinggi
    />
  );
}