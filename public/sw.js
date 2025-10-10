const CACHE_VERSION = '3.0.1'
const CACHE_NAME = `nonce-firewall-v${CACHE_VERSION}`
const STATIC_CACHE = `static-v${CACHE_VERSION}`
const DYNAMIC_CACHE = `dynamic-v${CACHE_VERSION}`
const IMAGE_CACHE = `images-v${CACHE_VERSION}`

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/tech-logos/react.webp',
  '/tech-logos/nextjs.webp',
  '/tech-logos/typescript.webp',
  '/tech-logos/tailwindcss.webp',
  '/tech-logos/supabase.webp',
  '/tech-logos/postgresql.webp',
  '/tech-logos/javascript.webp',
  '/tech-logos/html.webp'
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\//,
  /supabase\.co/,
  /supabase\.in/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /images\.pexels\.com/,
  /cxhspurcxgcseikfwnpm\.supabase\.co/,
  /stackblitz\.com\/storage/
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error)
      })
  )
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    handleFetch(request)
  )
})

async function handleFetch(request) {
  const url = new URL(request.url)

  try {
    if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
      return await cacheFirstImage(request)
    }

    if (STATIC_ASSETS.some(asset => url.pathname === asset) ||
        url.pathname.match(/\.(js|css|ico|woff|woff2|ttf|eot)$/)) {
      return await cacheFirst(request)
    }

    if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
      return await networkFirst(request, 3000)
    }

    if (url.pathname.startsWith('/') && request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidate(request)
    }

    return await networkFirst(request)

  } catch (error) {
    console.error('Service Worker: Fetch error', error)

    if (request.headers.get('accept')?.includes('text/html')) {
      const cache = await caches.open(STATIC_CACHE)
      return await cache.match('/') || new Response('Offline', { status: 503 })
    }

    return new Response('Network error', { status: 503 })
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  const response = await fetch(request)
  if (response.ok) {
    cache.put(request, response.clone())
  }

  return response
}

async function cacheFirstImage(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  const response = await fetch(request)
  if (response.ok) {
    cache.put(request, response.clone())
  }

  return response
}

async function networkFirst(request, timeout = 5000) {
  const cache = await caches.open(DYNAMIC_CACHE)

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(request, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    throw error
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cached = await cache.match(request)
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => cached)
  
  return cached || await fetchPromise
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag)
  
  if (event.tag === 'background-sync' || event.tag === 'content-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle offline actions when back online - sync form submissions, comments, etc.
  console.log('Service Worker: Performing background sync')
  
  // Sync any pending newsletter subscriptions
  try {
    const pendingSubscriptions = await getStoredData('pending-subscriptions')
    if (pendingSubscriptions && pendingSubscriptions.length > 0) {
      // Process pending subscriptions
      console.log('Processing pending newsletter subscriptions')
    }
  } catch (error) {
    console.error('Error syncing newsletter subscriptions:', error)
  }
  
  // Sync any pending contact form submissions
  try {
    const pendingContacts = await getStoredData('pending-contacts')
    if (pendingContacts && pendingContacts.length > 0) {
      // Process pending contact submissions
      console.log('Processing pending contact submissions')
    }
  } catch (error) {
    console.error('Error syncing contact submissions:', error)
  }
}

// Helper function to get stored data
async function getStoredData(key) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const response = await cache.match(`/offline-data/${key}`)
    if (response) {
      return await response.json()
    }
  } catch (error) {
    console.error('Error getting stored data:', error)
  }
  return null
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey,
        url: data.url || '/'
      },
      actions: [
        {
          action: 'explore',
          title: 'Open',
          icon: '/favicon-32x32.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/favicon-32x32.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})