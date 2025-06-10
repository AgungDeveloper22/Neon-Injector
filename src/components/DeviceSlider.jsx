import { useEffect, useState } from 'react';
import { FaHome, FaSearch, FaUser, FaCog } from 'react-icons/fa';

export default function DeviceSlider() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('#phonePreview');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  if (!isVisible) {
    return <div id="phonePreview" className="h-96" role="region" aria-label="Phone preview placeholder"></div>;
  }

  return (
    <section id="phonePreview" className="py-12 sm:py-16 relative z-10 container" role="region" aria-label="App preview section">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">
        App: <span className="text-neon-purple-light">Preview</span>
      </h2>
      <div className="relative mx-auto max-w-[360px] aspect-[9/19] rounded-[40px] shadow-md shadow-neon-glow border-4 border-[var(--bg-color)] overflow-hidden bg-[var(--bg-color)]">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-[var(--bg-color)] rounded-b-2xl z-20">
          <div className="w-4 h-1 bg-gray-600 rounded-full mx-auto mt-2"></div>
        </div>
        <div className="absolute top-6 left-0 w-full h-[calc(100%-64px)]">
          <iframe
            src="https://skinml.my.id"
            title="Phone Preview"
            className="w-full h-full border-none"
            loading="lazy"
            aria-label="Mobile Legends skin preview"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-[var(--bg-color)] flex justify-around items-center">
          <FaHome className="text-[var(--text-color)] text-xl" aria-hidden="true" />
          <FaSearch className="text-[var(--text-color)] text-xl" aria-hidden="true" />
          <FaUser className="text-[var(--text-color)] text-xl" aria-hidden="true" />
          <FaCog className="text-[var(--text-color)] text-xl" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}