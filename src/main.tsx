import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources, measurePerformance } from './utils/performance'
import { registerSW, preloadTechStackImages } from './utils/pwa'

// Initialize performance monitoring and optimizations
preloadCriticalResources()
measurePerformance()
registerSW()

// Preload tech stack images after initial load
setTimeout(() => {
  preloadTechStackImages()
}, 2000)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)