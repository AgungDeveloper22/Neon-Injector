import { useState } from 'react';
import DarkModeToggle from './DarkModeToggle.jsx';
import Hamburger from './Hamburger.jsx';
import Sidebar from './Sidebar.jsx';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (value) => {
    setIsSidebarOpen(typeof value === 'boolean' ? value : !isSidebarOpen);
  };

  const menus = [
    { name: 'Home', href: '/' },
    { name: 'Download', href: '/download' },
    { name: 'Docs', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Team', href: '/team' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ];

  return (
    <header className="bg-[var(--bg-color)] p-4 fixed w-full top-0 z-50 border-b border-[var(--neon-purple-dark)]" role="banner">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--heading-color)]">Neon Injector</h1>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-4" aria-label="Main navigation">
            {menus.map((menu) => (
              <a
                key={menu.name}
                href={menu.href}
                className="text-[var(--text-color)] hover:text-[var(--neon-purple-light)] px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)]"
                aria-label={`Navigate to ${menu.name} page`}
              >
                {menu.name}
              </a>
            ))}
          </nav>
          <DarkModeToggle />
          <Hamburger onToggle={toggleSidebar} isOpen={isSidebarOpen} />
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} toggleMenu={toggleSidebar} />
    </header>
  );
}