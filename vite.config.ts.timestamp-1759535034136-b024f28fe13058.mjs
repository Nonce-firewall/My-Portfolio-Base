// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react", "framer-motion"],
          editor: ["react-quill", "quill"],
          supabase: ["@supabase/supabase-js"],
          forms: ["@formspree/react"],
          syntax: ["react-syntax-highlighter"]
        },
        assetFileNames: (assetInfo) => {
          var _a;
          const info = (_a = assetInfo.name) == null ? void 0 : _a.split(".");
          const extType = info == null ? void 0 : info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType || "")) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType || "")) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js"
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    minify: "terser",
    chunkSizeWarningLimit: 1e3,
    ...process.env.NODE_ENV === "production" && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log", "console.info", "console.debug"],
          passes: 2
        },
        format: {
          comments: false
        }
      }
    },
    assetsInlineLimit: 4096,
    reportCompressedSize: true
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "@supabase/postgrest-js"],
    exclude: ["@supabase/supabase-js"]
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgIHJvdXRlcjogWydyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgdWk6IFsnbHVjaWRlLXJlYWN0JywgJ2ZyYW1lci1tb3Rpb24nXSxcbiAgICAgICAgICBlZGl0b3I6IFsncmVhY3QtcXVpbGwnLCAncXVpbGwnXSxcbiAgICAgICAgICBzdXBhYmFzZTogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcbiAgICAgICAgICBmb3JtczogWydAZm9ybXNwcmVlL3JlYWN0J10sXG4gICAgICAgICAgc3ludGF4OiBbJ3JlYWN0LXN5bnRheC1oaWdobGlnaHRlciddXG4gICAgICAgIH0sXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5mbyA9IGFzc2V0SW5mby5uYW1lPy5zcGxpdCgnLicpXG4gICAgICAgICAgY29uc3QgZXh0VHlwZSA9IGluZm8/LltpbmZvLmxlbmd0aCAtIDFdXG4gICAgICAgICAgaWYgKC9wbmd8anBlP2d8c3ZnfGdpZnx0aWZmfGJtcHxpY298d2VicC9pLnRlc3QoZXh0VHlwZSB8fCAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL2ltYWdlcy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYFxuICAgICAgICAgIH0gZWxzZSBpZiAoL3dvZmZ8d29mZjJ8ZW90fHR0ZnxvdGYvaS50ZXN0KGV4dFR5cGUgfHwgJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gYGFzc2V0cy9mb250cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYFxuICAgICAgICB9LFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcydcbiAgICAgIH1cbiAgICB9LFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgIC4uLihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nICYmIHtcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUuaW5mbycsICdjb25zb2xlLmRlYnVnJ10sXG4gICAgICAgICAgcGFzc2VzOiAyXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgIGNvbW1lbnRzOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSksXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IHRydWVcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbScsICdAc3VwYWJhc2UvcG9zdGdyZXN0LWpzJ10sXG4gICAgZXhjbHVkZTogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IGZhbHNlXG4gICAgfVxuICB9XG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsVUFDN0IsUUFBUSxDQUFDLGtCQUFrQjtBQUFBLFVBQzNCLElBQUksQ0FBQyxnQkFBZ0IsZUFBZTtBQUFBLFVBQ3BDLFFBQVEsQ0FBQyxlQUFlLE9BQU87QUFBQSxVQUMvQixVQUFVLENBQUMsdUJBQXVCO0FBQUEsVUFDbEMsT0FBTyxDQUFDLGtCQUFrQjtBQUFBLFVBQzFCLFFBQVEsQ0FBQywwQkFBMEI7QUFBQSxRQUNyQztBQUFBLFFBQ0EsZ0JBQWdCLENBQUMsY0FBYztBQWxCdkM7QUFtQlUsZ0JBQU0sUUFBTyxlQUFVLFNBQVYsbUJBQWdCLE1BQU07QUFDbkMsZ0JBQU0sVUFBVSw2QkFBTyxLQUFLLFNBQVM7QUFDckMsY0FBSSx1Q0FBdUMsS0FBSyxXQUFXLEVBQUUsR0FBRztBQUM5RCxtQkFBTztBQUFBLFVBQ1QsV0FBVywwQkFBMEIsS0FBSyxXQUFXLEVBQUUsR0FBRztBQUN4RCxtQkFBTztBQUFBLFVBQ1Q7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFBQSxRQUNBLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLElBQ2QsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsdUJBQXVCO0FBQUEsSUFDdkIsR0FBSSxRQUFRLElBQUksYUFBYSxnQkFBZ0I7QUFBQSxNQUMzQyxlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxlQUFlO0FBQUEsVUFDZixZQUFZLENBQUMsZUFBZSxnQkFBZ0IsZUFBZTtBQUFBLFVBQzNELFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQSxRQUFRO0FBQUEsVUFDTixVQUFVO0FBQUEsUUFDWjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxtQkFBbUI7QUFBQSxJQUNuQixzQkFBc0I7QUFBQSxFQUN4QjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFNBQVMsYUFBYSxvQkFBb0Isd0JBQXdCO0FBQUEsSUFDNUUsU0FBUyxDQUFDLHVCQUF1QjtBQUFBLEVBQ25DO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
