import { useState } from 'react';
import DarkModeToggle from './DarkModeToggle.jsx';
import Hamburger from './Hamburger.jsx';

export default function Header() {
  const menus = [
    { name: 'Home', href: '/' },
    { name: 'Download', href: '/download' },
    { name: 'Docs', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Team', href: '/team' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ];

  return (
    <header className="bg-[var(--bg-color)] p-4 fixed w-full top-0 z-50 border-b border-neon-purple-dark">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--heading-color)]">Neon Injector</h1>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-4">
            {menus.map((menu) => (
              <a
                key={menu.name}
                href={menu.href}
                className="text-[var(--text-color)] hover:text-neon-purple-light px-3 py-2 rounded-lg transition-colors"
              >
                {menu.name}
              </a>
            ))}
          </nav>
          <DarkModeToggle />
          <Hamburger />
        </div>
      </div>
    </header>
  );
}