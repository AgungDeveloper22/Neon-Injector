import { useEffect } from 'react';

export default function Sidebar() {
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
      const sidebar = document.getElementById('mobile-menu');
      if (window.innerWidth >= 768 && sidebar) {
        sidebar.classList.add('hidden');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      id="mobile-menu"
      className="fixed inset-y-0 left-0 w-64 bg-[var(--bg-color)] p-6 transform -translate-x-full transition-transform duration-300 ease-in-out z-50 hidden md:hidden"
    >
      <nav>
        <ul className="space-y-4">
          {menus.map((menu) => (
            <li key={menu.name}>
              <a
                href={menu.href}
                className="text-[var(--text-color)] hover:text-neon-purple-light hover:bg-neon-purple-dark/20 px-4 py-2 rounded-lg transition-colors block"
              >
                {menu.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}