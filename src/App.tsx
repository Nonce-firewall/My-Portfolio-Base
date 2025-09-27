import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; [span_0](start_span)//[span_0](end_span)
import { Suspense, lazy, memo } from 'react'; [span_1](start_span)//[span_1](end_span)
import { HelmetProvider } from 'react-helmet-async'; [span_2](start_span)//[span_2](end_span)
import { AuthProvider } from './hooks/useAuth'; [span_3](start_span)//[span_3](end_span)
import ProtectedRoute from './components/ProtectedRoute'; [span_4](start_span)//[span_4](end_span)
import Navigation from './components/Navigation'; [span_5](start_span)//[span_5](end_span)
import Footer from './components/Footer'; [span_6](start_span)//[span_6](end_span)
import { usePWA } from './hooks/usePWA'; [span_7](start_span)//[span_7](end_span)
import PWAInstallPrompt from './components/PWAInstallPrompt'; [span_8](start_span)//[span_8](end_span)
import OfflineIndicator from './components/OfflineIndicator'; [span_9](start_span)//[span_9](end_span)
import PWAUpdatePrompt from './components/PWAUpdatePrompt'; [span_10](start_span)//[span_10](end_span)
import React from 'react'; [span_11](start_span)//[span_11](end_span)
import toast, { Toaster } from 'react-hot-toast'; [span_12](start_span)//[span_12](end_span)

[span_13](start_span)// Lazy load page components[span_13](end_span)
const Home = lazy(() => import('./pages/Home')); [span_14](start_span)//[span_14](end_span)
const Projects = lazy(() => import('./pages/Projects')); [span_15](start_span)//[span_15](end_span)
const About = lazy(() => import('./pages/About')); [span_16](start_span)//[span_16](end_span)
const Contact = lazy(() => import('./pages/Contact')); [span_17](start_span)//[span_17](end_span)
const Reviews = lazy(() => import('./pages/Reviews')); [span_18](start_span)//[span_18](end_span)
const Products = lazy(() => import('./pages/Products')); [span_19](start_span)//[span_19](end_span)
const Blog = lazy(() => import('./pages/Blog')); [span_20](start_span)//[span_20](end_span)
const BlogPost = lazy(() => import('./pages/BlogPost')); [span_21](start_span)//[span_21](end_span)
const ProjectDetail = lazy(() => import('./pages/ProjectDetail')); [span_22](start_span)//[span_22](end_span)

[span_23](start_span)// Lazy load admin components[span_23](end_span)
const AdminDashboard = lazy(() => import('./admin/AdminDashboard')); [span_24](start_span)//[span_24](end_span)
const AdminLogin = lazy(() => import('./admin/AdminLogin')); [span_25](start_span)//[span_25](end_span)

[span_26](start_span)// Loading component[span_26](end_span)
const PageLoader = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
));
[span_27](start_span)function App() { //[span_27](end_span)
  [span_28](start_span)const { //[span_28](end_span)
    [span_29](start_span)isInstallable, //[span_29](end_span)
    [span_30](start_span)installApp, //[span_30](end_span)
    [span_31](start_span)showUpdatePrompt, //[span_31](end_span)
    [span_32](start_span)updateApp, //[span_32](end_span)
    [span_33](start_span)dismissUpdatePrompt //[span_33](end_span)
  } = usePWA(() => {
    [span_34](start_span)toast.success('Nonce Firewall has been installed successfully!'); //[span_34](end_span)
  });
  [span_35](start_span)// Preload admin components when user is authenticated[span_35](end_span)
  [span_36](start_span)React.useEffect(() => { //[span_36](end_span)
    const checkAuthAndPreload = async () => {
      const { data: { session } } = await import('./lib/supabase').then(m => m.supabase.auth.getSession());
      if (session?.user) {
        import('./utils/lazyComponents').then(({ preloadAdminComponents }) => {
          preloadAdminComponents();
        });
        import('./utils/pwa').then(({ preloadAdminRoutes }) => {
          preloadAdminRoutes();
        }); [span_37](start_span)//[span_37](end_span)
      }
    };
    
    checkAuthAndPreload();
  }, []); [span_38](start_span)//[span_38](end_span)
  [span_39](start_span)return ( //[span_39](end_span)
    <HelmetProvider> 
      <AuthProvider> 
        <Router>
          <Toaster position="bottom-center" />

          {/* FIX: Added the required onDismiss prop with an empty function. */}
          <PWAInstallPrompt
            isVisible={isInstallable && !showUpdatePrompt}
            onInstall={installApp}
            onDismiss={() => {}}
          />
   
          {/* FIX: Use navigator.onLine directly as the hook doesn't provide isOffline. */} 
          <OfflineIndicator isOffline={!navigator.onLine} /> 
          <PWAUpdatePrompt
            isVisible={showUpdatePrompt}
            onUpdate={updateApp}
            onDismiss={dismissUpdatePrompt}
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
  );
}

export default App;
