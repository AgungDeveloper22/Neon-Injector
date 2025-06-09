export default function Sidebar() {
  const menus = [
    { name: 'Home', href: '/' },
    { name: 'Download', href: '/download' },
    { name: 'Docs', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Team', href: '/team' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ];

  return (
    <aside
      id="sidebar"
      className="fixed inset-y-0 left-0 w-64 bg-dark-bg dark:bg-light-bg p-6 transform -translate-x-full transition-transform duration-300 ease-in-out z-50 md:translate-x-0 md:static md:w-1/5 md:min-h-screen"
    >
      <nav>
        <ul className="space-y-4">
          {menus.map((menu) => (
            <li key={menu.name}>
              <a
                href={menu.href}
                className="text-gray-300 dark:text-light-text hover:text-neon-purple-light hover:bg-neon-purple-dark/20 px-4 py-2 rounded-lg transition-colors block"
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