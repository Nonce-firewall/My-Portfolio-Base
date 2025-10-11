import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

setTimeout(() => {
  import('./utils/performance').then(({ preloadCriticalResources, measurePerformance }) => {
    preloadCriticalResources()
    measurePerformance()
  })

  import('./utils/pwa').then(({ registerSW, preloadTechStackImages }) => {
    registerSW()
    setTimeout(() => {
      preloadTechStackImages()
    }, 1000)
  })
}, 100)
