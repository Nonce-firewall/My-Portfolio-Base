// PWA utilities and service worker registration

export const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Check if we're in a development environment that doesn't support service workers
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('webcontainer')) {
        console.log('Service worker registration skipped in development environment')
        return
      }
      
      console.log('Registering service worker...')
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      
      console.log('Service worker registered successfully:', registration.scope)
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker installed, update available')
              // Dispatch custom event for update notification
              window.dispatchEvent(new CustomEvent('sw-update-available'))
            }
          })
        }
      })
      
      // Check for updates every 60 seconds
      setInterval(() => {
        registration.update()
      }, 60000)
      
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  } else {
    console.log('Service workers are not supported')
  }
}

export const unregisterSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
      console.log('Service workers unregistered')
    } catch (error) {
      console.error('Error unregistering service workers:', error)
    }
  }
}

// Check if app is running as PWA
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://')
}

// Get install prompt availability
export const getInstallPrompt = (): Promise<any> => {
  return new Promise((resolve) => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      resolve(e)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Timeout after 5 seconds
    setTimeout(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      resolve(null)
    }, 5000)
  })
}

// Cache management utilities
export const clearAppCache = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('App cache cleared')
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }
}

// Preload critical routes for offline access
export const preloadCriticalRoutes = async () => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('dynamic-v2.0.0')
      const criticalRoutes = [
        '/',
        '/projects',
        '/projects/featured',
        '/about',
        '/contact',
        '/blog',
        '/reviews',
        '/products',
        '/admin/login'
      ]
      
      await Promise.all(
        criticalRoutes.map(route => 
          fetch(route).then(response => {
            if (response.ok) {
              cache.put(route, response.clone())
            }
          }).catch(() => {
            // Ignore errors for preloading
          })
        )
      )
      
      console.log('Critical routes preloaded')
    } catch (error) {
      console.error('Error preloading routes:', error)
    }
  }
}

// Preload admin routes for authenticated users
export const preloadAdminRoutes = async () => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('dynamic-v2.0.0')
      const adminRoutes = [
        '/admin',
        '/admin/login',
        '/admin/settings',
        '/admin/projects',
        '/admin/blog',
        '/admin/reviews'
      ]
      
      await Promise.all(
        adminRoutes.map(route => 
          fetch(route).then(response => {
            if (response.ok) {
              cache.put(route, response.clone())
            }
          }).catch(() => {
            // Ignore errors for preloading
          })
        )
      )
      
      console.log('Admin routes preloaded')
    } catch (error) {
      console.error('Error preloading admin routes:', error)
    }
  }
}

// Store data for offline sync
export const storeOfflineData = async (key: string, data: any) => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('dynamic-v2.0.0')
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      })
      await cache.put(`/offline-data/${key}`, response)
      console.log(`Offline data stored: ${key}`)
    } catch (error) {
      console.error('Error storing offline data:', error)
    }
  }
}

// Request background sync
export const requestBackgroundSync = async (tag: string = 'content-sync') => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register(tag)
      console.log('Background sync requested:', tag)
    } catch (error) {
      console.error('Error requesting background sync:', error)
    }
  }
}

// Enhanced cache management for tech stack images
export const preloadTechStackImages = async () => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('static-v2.0.0')
      const techImages = [
        '/tech-logos/react.webp',
        '/tech-logos/nextjs.webp',
        '/tech-logos/typescript.webp',
        '/tech-logos/tailwindcss.webp',
        '/tech-logos/supabase.webp',
        '/tech-logos/postgresql.webp',
        '/tech-logos/javascript.webp',
        '/tech-logos/html.webp',
        '/tech-logos/figma.webp',
        '/tech-logos/motion.webp',
        '/tech-logos/wordpress.webp',
        '/tech-logos/github.webp',
        '/tech-logos/git.webp'
      ]
      
      await Promise.all(
        techImages.map(image => 
          fetch(image).then(response => {
            if (response.ok) {
              cache.put(image, response.clone())
            }
          }).catch(() => {
            // Ignore errors for preloading
          })
        )
      )
      
      console.log('Tech stack images preloaded')
    } catch (error) {
      console.error('Error preloading tech stack images:', error)
    }
  }
}