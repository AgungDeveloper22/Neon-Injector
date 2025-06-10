import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Sidebar({ isOpen, onClose }) {
  const menus = [
    { name: 'Home', href: '/' },
    { name: 'Download', href: '/download' },
    { name: 'Docs', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Team', href: '/team' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        onClose();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <motion.aside
      id="mobile-menu"
      className="fixed inset-y-0 left-0 w-64 bg-[var(--bg-color)] p-6 z-50 md:hidden border-r border-[var(--neon-purple-dark)]"
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      role="dialog"
      aria-label="Mobile navigation menu"
      aria-hidden={!isOpen}
    >
      <nav aria-label="Mobile navigation">
        <ul className="space-y-4">
          {menus.map((menu) => (
            <li key={menu.name}>
              <a
                href={menu.href}
                onClick={onClose}
                className="text-[var(--text-color)] hover:text-[var(--neon-purple-light)] hover:bg-[var(--neon-purple-dark)]/20 px-4 py-2 rounded-lg transition-colors block focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)]"
                aria-label={`Navigate to ${menu.name} page`}
              >
                {menu.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
}