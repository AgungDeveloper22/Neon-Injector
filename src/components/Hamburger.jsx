import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Hamburger({ onToggle, isOpen }) {
  const toggleMenu = () => {
    onToggle(!isOpen);
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: 90 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  };

  return (
    <button
      onClick={toggleMenu}
      className="md:hidden text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] rounded-sm p-1"
      aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <motion.div className="relative w-6 h-6">
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate={isOpen ? 'hidden' : 'visible'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <FaBars className="w-6 h-6" />
        </motion.div>
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <FaTimes className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </button>
  );
}