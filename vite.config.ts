import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Bridges the Vercel API_KEY environment variable to the browser.
    // We use a fallback empty string to ensure the code remains syntactically valid.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env': {}
  },
  build: {
    // Increase chunk size limit to suppress warnings if necessary, 
    // though the current app size should be fine.
    chunkSizeWarningLimit: 1000,
  }
});