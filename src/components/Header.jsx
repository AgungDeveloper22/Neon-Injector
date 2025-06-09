import Hamburger from './Hamburger.jsx';
import DarkModeToggle from './DarkModeToggle.jsx';

export default function Header() {
  return (
    <header className="bg-dark-bg dark:bg-light-bg p-4 fixed w-full top-0 z-50 border-b border-neon-purple-dark">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neon-purple dark:text-neon-purple">Neon Injector</h1>
        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          <Hamburger />
        </div>
      </div>
    </header>
  );
}