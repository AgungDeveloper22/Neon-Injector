import React from 'react';

const Toast = () => {
  return (
    <div
      id="toast"
      className="fixed bottom-4 right-4 hidden p-4 rounded-lg shadow-lg text-white text-sm transition-opacity duration-300 opacity-0"
    ></div>
  );
};

export default Toast;