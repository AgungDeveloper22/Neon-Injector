import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const features = [
  {
    title: 'Easy to Use',
    description:
      'Neon Injector is designed with a user-friendly interface, allowing you to inject Mobile Legends skins quickly and effortlessly, even for beginners.',
    animation: 'https://lottie.host/1b9882fb-6269-4490-8e5d-44bb9a0c94e1/MLsQNB7IZk.lottie', // UI design animation
    alt: 'Animation of a user-friendly interface design',
  },
  {
    title: 'Focus on Skins',
    description:
      'Neon Injector streamlines the skin injection process, letting you focus on customizing your Mobile Legends heroes while we handle the technical details.',
    animation: 'https://lottie.host/feb11590-1ca3-46ac-9f14-606a8b49a1f1/pyoUlv7qWn.lottie', // Game character animation
    alt: 'Animation of game character customization',
  },
  {
    title: 'Safe to Use',
    description:
      'Neon Injector is secure and trusted, ensuring your Mobile Legends account remains safe. Our source code is open on GitHub for transparency.',
    animation: 'https://lottie.host/f537027f-7cc9-4339-b07e-934d4e1461e7/bAZMMaEcwO.lottie', // Security shield animation
    alt: 'Animation of a security shield protecting data',
  },
  {
    title: 'Interactive Skin Preview',
    description:
      'Preview Mobile Legends skins in real-time with Neon Injector’s built-in interactive viewer, so you can see your customizations before applying them.',
    animation: 'https://lottie.host/29ecd3ca-a7a4-475e-b7ea-93ee88547705/ebNXpkb0hC.lottie', // Preview interface animation
    alt: 'Animation of an interactive preview interface',
  },
  {
    title: 'Huge Community',
    description:
      'Join our vibrant community on Discord and Telegram to ask questions, share skin ideas, or connect with other Mobile Legends players.',
    animation: 'https://lottie.host/0c34f316-5930-4d8c-a413-59d2f5265b5d/hdtMvSmTMh.lottie', // Community chat animation
    alt: 'Animation of a vibrant community chat',
  },
  {
    title: 'Free Forever',
    description:
      'Neon Injector is completely free, with open-source code available on GitHub. Enjoy premium skin customization without any cost.',
    animation: 'https://lottie.host/2221d2c8-7aa3-4d9a-9142-485ccd4db397/C0ZoOmxaCX.lottie', // Free badge animation
    alt: 'Animation of a free badge with gaming elements',
  },
];

const FeaturesCard = () => {
  return (
    <section className="py-12 sm:py-16 relative z-10 px-4 sm:px-6" client:load>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-purple-600 dark:text-purple-400">
        Apptastic Features: <span className="text-purple-500 dark:text-purple-300">Neon Injector Toolkit for Success</span>
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-lg p-6 flex flex-col items-center text-center transition-transform hover:scale-105"
          >
            <DotLottieReact
              src={feature.animation}
              loop
              autoplay
              className="w-full h-40 mb-4"
              aria-label={feature.alt}
            />
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesCard;