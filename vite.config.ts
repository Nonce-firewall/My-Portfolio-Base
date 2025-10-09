import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('react-router')) {
              return 'vendor-router'
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'vendor-ui'
            }
            if (id.includes('quill') || id.includes('react-quill')) {
              return 'vendor-editor'
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase'
            }
            if (id.includes('react-syntax-highlighter')) {
              return 'vendor-syntax'
            }
            return 'vendor-other'
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.')
          const extType = info?.[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType || '')) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType || '')) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    ...(process.env.NODE_ENV === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 3,
          unsafe_arrows: true,
          unsafe_methods: true
        },
        format: {
          comments: false
        },
        mangle: {
          safari10: true
        }
      }
    }),
    assetsInlineLimit: 4096,
    reportCompressedSize: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/postgrest-js'],
    exclude: ['@supabase/supabase-js']
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})