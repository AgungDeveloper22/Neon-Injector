import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-dark-bg dark:bg-light-bg rounded-full p-1 flex items-center transition-colors duration-300 shadow-neon-glow"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className="w-4 h-4 bg-neon-purple rounded-full flex items-center justify-center shadow-md"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isDark ? (
          <FaSun className="text-white" size={12} />
        ) : (
          <FaMoon className="text-white" size={12} />
        )}
      </motion.div>
    </button>
  );
}