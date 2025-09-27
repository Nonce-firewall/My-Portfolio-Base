import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { preloadCriticalResources, measurePerformance } from './utils/performance';
import { preloadTechStackImages } from './utils/pwa';
import { Workbox } from 'workbox-window'; // <-- Import Workbox

// Initialize performance monitoring and optimizations
preloadCriticalResources();
measurePerformance();

// --- Service Worker Registration Logic ---
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js'); // Assuming your service worker is named sw.js

  wb.addEventListener('waiting', (event) => {
    // A new service worker is waiting to activate.
    // Dispatch the custom event that your PWA hooks can listen for.
    const registration = event.sw;
    if (registration) {
      document.dispatchEvent(new CustomEvent('swUpdate', { detail: registration }));
    }
  });

  wb.register();
}
// -----------------------------------------

// Preload tech stack images after initial load
setTimeout(() => {
  preloadTechStackImages();
}, 2000);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
