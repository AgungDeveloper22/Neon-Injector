import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    const sidebar = document.getElementById('mobile-menu');
    if (sidebar) {
      sidebar.classList.toggle('hidden');
    }
  };

  return (
    <button onClick={toggleMenu} className="md:hidden text-[var(--heading-color)] focus:outline-none">
      <motion.svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          animate={isOpen ? { d: 'M6 18L18 6M6 6l12 12' } : { d: 'M4 6h16M4 12h16m-7 6h7' }}
          transition={{ duration: 0.3 }}
        />
      </motion.svg>
    </button>
  );
}