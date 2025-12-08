import { defineConfig } from 'vite';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default defineConfig({
  // Base path for production deployment, set to '/' for development
  base: './',
  
  // Configure the server
  server: {
    port: 8888,
    strictPort: true,
    open: true, // Automatically open browser when starting
    host: true,
  },
  
  // Build options
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      plugins: [polyfillNode()],
    }
  },
  
  // Resolve options for module resolution
  resolve: {
    alias: {
      // Node.js polyfills for dev and build
      events: 'events'
    }
  },
  
  define: {
    global: 'globalThis',
  },
  
  // Optimizations to avoid issues with external dependencies
  optimizeDeps: {
    include: ['sigma', 'graphology', 'graphology-layout', 'graphology-layout-forceatlas2', 'events']
  }
}); 