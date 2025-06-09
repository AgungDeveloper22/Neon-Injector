import React, { useEffect, useState } from 'react';
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
    return <div id="phonePreview" className="h-96"></div>;
  }

  return (
    <section id="phonePreview" className="py-12 sm:py-16 relative z-10 px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-purple-600 dark:text-purple-400">
        App: <span className="text-purple-500 dark:text-purple-300">Preview</span>
      </h2>
      <div className="relative mx-auto max-w-[360px] aspect-[9/19] rounded-[40px] shadow-md shadow-purple-500/30 dark:shadow-purple-300/30 border-4 border-gray-800 dark:border-gray-200 overflow-hidden bg-gray-900 dark:bg-gray-100">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gray-900 dark:bg-gray-100 rounded-b-2xl z-20">
          <div className="w-4 h-1 bg-gray-600 dark:bg-gray-400 rounded-full mx-auto mt-2"></div>
        </div>
        <div className="absolute top-6 left-0 w-full h-[calc(100%-64px)]">
          <iframe
            src="https://skinml.my.id"
            title="Phone Preview"
            className="w-full h-full border-none"
            loading="lazy"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gray-800 dark:bg-gray-200 flex justify-around items-center">
          <FaHome className="text-white dark:text-gray-800 text-xl" />
          <FaSearch className="text-white dark:text-gray-800 text-xl" />
          <FaUser className="text-white dark:text-gray-800 text-xl" />
          <FaCog className="text-white dark:text-gray-800 text-xl" />
        </div>
      </div>
    </section>
  );
}