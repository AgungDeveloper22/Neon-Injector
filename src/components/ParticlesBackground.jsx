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
        number: { value: 70, density: { enable: true, value_area: 800 } }, // Increased to 70 for more connections
        color: { value: '#8b5cf6' },
        shape: { type: 'circle' },
        opacity: { value: 0.4, random: false }, // Slightly higher opacity for visibility
        size: { value: 4, random: true, anim: { enable: false } }, // Larger particles
        links: {
          enable: true,
          distance: 200, // Increased for more connections
          color: '#a78bfa',
          opacity: 0.3, // Balanced opacity
          width: 1, // Slightly thicker lines
        },
        move: {
          enable: true,
          speed: 1.5, // Balanced speed
          direction: 'none',
          random: false,
          straight: false,
          outModes: { default: 'out' },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: false }, // Disabled for performance
          onClick: { enable: false }, // Disabled for performance
        },
      },
      performance: {
        fpsLimit: 30, // Lower FPS for performance
        detectRetina: false, // Disable retina detection
      },
    }),
    [isDark, isVisible]
  );

  if (!isVisible) {
    return <div id="particlesBackground" className="absolute inset-0"></div>;
  }

  return <Particles id="tsparticles" options={options} />;
}