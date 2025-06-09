import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark-bg dark:bg-light-bg p-4 sm:p-6 border-t border-neon-purple-dark w-full">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center sm:text-left">
        <div className="flex space-x-4 justify-center sm:justify-start">
          <a href="https://facebook.com" className="text-neon-purple hover:text-neon-purple-light transition">
            <FaFacebook size={20} />
          </a>
          <a href="https://twitter.com" className="text-neon-purple hover:text-neon-purple-light transition">
            <FaTwitter size={20} />
          </a>
          <a href="https://instagram.com" className="text-neon-purple hover:text-neon-purple-light transition">
            <FaInstagram size={20} />
          </a>
          <a href="https://github.com" className="text-neon-purple hover:text-neon-purple-light transition">
            <FaGithub size={20} />
          </a>
        </div>
        <div className="text-gray-300 dark:text-light-text text-sm sm:text-base">
          <a href="/privacy-policy" className="hover:text-neon-purple-light transition">Privacy Policy</a> |{' '}
          <a href="/contact-us" className="hover:text-neon-purple-light transition">Contact Us</a> |{' '}
          <a href="/about" className="hover:text-neon-purple-light transition">About</a> |{' '}
          <a href="/terms-service" className="hover:text-neon-purple-light transition">Terms of Service</a>
        </div>
        <div className="text-neon-purple dark:text-neon-purple text-sm sm:text-base md:text-right">
          <p>© 2025 Neon Injector. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}