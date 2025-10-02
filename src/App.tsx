import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy, memo } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { usePWA } from './hooks/usePWA'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import OfflineIndicator from './components/OfflineIndicator'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import React from 'react'

// Lazy load page components
const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Reviews = lazy(() => import('./pages/Reviews'))
const Products = lazy(() => import('./pages/Products'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))

// Lazy load admin components
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))
const AdminLogin = lazy(() => import('./admin/AdminLogin'))

// Loading component
const PageLoader = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)
)

function App() {
  const {
    showInstallPrompt,
    isOffline,
    isInstalled,
    installApp,
    dismissInstallPrompt
  } = usePWA()

  const [showUpdatePrompt, setShowUpdatePrompt] = React.useState(false)

  React.useEffect(() => {
    if ('serviceWorker' in navigator && isInstalled) {
      const handleUpdate = () => {
        const lastVersion = localStorage.getItem('pwa-last-version')
        const currentVersion = '3.0.0'

        if (lastVersion && lastVersion !== currentVersion) {
          setShowUpdatePrompt(true)
          localStorage.setItem('pwa-last-version', currentVersion)
        }
      }

      navigator.serviceWorker.addEventListener('controllerchange', handleUpdate)

      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowUpdatePrompt(true)
                }
              })
            }
          })

          setInterval(() => {
            registration.update()
          }, 60000)
        }
      })

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleUpdate)
      }
    }
  }, [isInstalled])

  const handleUpdate = () => {
    window.location.reload()
  }
  
  // Preload admin components when user is authenticated
  React.useEffect(() => {
    const checkAuthAndPreload = async () => {
      const { data: { session } } = await import('./lib/supabase').then(m => m.supabase.auth.getSession())
      if (session?.user) {
        // Preload admin components for faster navigation
        import('./utils/lazyComponents').then(({ preloadAdminComponents }) => {
          preloadAdminComponents()
        })
        // Preload admin routes
        import('./utils/pwa').then(({ preloadAdminRoutes }) => {
          preloadAdminRoutes()
        })
      }
    }
    
    checkAuthAndPreload()
  }, [])

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          {/* PWA Components */}
          <PWAInstallPrompt
            isVisible={showInstallPrompt}
            onInstall={installApp}
            onDismiss={dismissInstallPrompt}
          />
          <OfflineIndicator isOffline={isOffline} />
          <PWAUpdatePrompt
            isVisible={showUpdatePrompt}
            onUpdate={handleUpdate}
            onDismiss={() => setShowUpdatePrompt(false)}
          />
          
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/*" element={
              <div className="min-h-[calc(100vh-64px)] bg-white smooth-scroll pt-16">
                <Navigation />
                <main className="relative overflow-hidden">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:id" element={<ProjectDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="/products" element={<Products />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
