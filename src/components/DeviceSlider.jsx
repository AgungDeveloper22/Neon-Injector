import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const devices = [
  { type: 'Android', url: 'https://skinml.my.id/' },
  { type: 'Tablet', url: 'https://skinml.my.id/view-hero' },
  { type: 'iOS', url: 'https://skinml.my.id/recall-animation' },
];

export default function DeviceSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % devices.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[560px] md:max-w-[600px] mx-auto">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <iframe
          src={devices[current].url}
          title={devices[current].type}
          className="w-[280px] h-[560px] sm:w-[560px] sm:h-[373px] md:w-[600px] md:h-[400px] border-2 border-neon-purple-dark dark:border-neon-purple rounded-lg"
        />
      </motion.div>
    </div>
  );
}