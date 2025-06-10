import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-color)] p-4 sm:p-6 border-t border-neon-purple-dark w-full" role="contentinfo">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center sm:text-left">
        <nav className="flex space-x-4 justify-center sm:justify-start" aria-label="Social media links">
          <a href="https://facebook.com" className="text-neon-purple hover:text-neon-purple-light transition focus:outline-none focus:ring-2 focus:ring-neon-purple" aria-label="Visit our Facebook page">
            <FaFacebook size={20} aria-hidden="true" />
          </a>
          <a href="https://twitter.com" className="text-neon-purple hover:text-neon-purple-light transition focus:outline-none focus:ring-2 focus:ring-neon-purple" aria-label="Visit our Twitter page">
            <FaTwitter size={20} aria-hidden="true" />
          </a>
          <a href="https://instagram.com" className="text-neon-purple hover:text-neon-purple-light transition focus:outline-none focus:ring-2 focus:ring-neon-purple" aria-label="Visit our Instagram page">
            <FaInstagram size={20} aria-hidden="true" />
          </a>
          <a href="https://github.com" className="text-neon-purple hover:text-neon-purple-light transition focus:outline-none focus:ring-2 focus:ring-neon-purple" aria-label="Visit our GitHub page">
            <FaGithub size={20} aria-hidden="true" />
          </a>
        </nav>
        <nav className="text-[var(--text-color)] text-sm sm:text-base" aria-label="Footer navigation">
          <a href="/privacy-policy" className="hover:text-neon-purple-light transition focus:outline-none focus:ring-2 focus:ring-neon-purple">Privacy Policy</a> |{' '}
          <a href="/contact-us" className="hover:text-neon-purple-light transition focus:outline-none focus:ring-2 focus:ring-neon-purple">Contact Us</a> |{' '}
          <a href="/about" className="hover:text-neon-purple-light transition focus:outline-none focus:ring-2 focus:ring-neon-purple">About</a> |{' '}
          <a href="/terms-service" className="hover:text-neon-purple-light transition focus:outline-none focus:ring-2 focus:ring-neon-purple">Terms of Service</a>
        </nav>
        <div className="text-[var(--text-color)] text-sm sm:text-base md:text-right">
          <p>© 2025 Neon Injector. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}