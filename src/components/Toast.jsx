import React, { useEffect } from 'react';

export default function Toast() {
  useEffect(() => {
    // Ensure toast is only initialized after the browser is idle
    const toast = document.getElementById('toast');
    if (toast) {
      // Any additional toast initialization logic can go here
    }
  }, []);

  return (
    <div
      id="toast"
      className="fixed bottom-4 right-4 hidden p-4 rounded-lg shadow-lg text-white text-sm transition-opacity duration-300 opacity-0"
    ></div>
  );
}