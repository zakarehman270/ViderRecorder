import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
  css: {
    postcss: {
      plugins: [tailwindcss()], // No need to include tailwindcss-motion here
    },
  },
});

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })
