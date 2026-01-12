import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    transformer: 'lightningcss',
  },
  plugins: [
    tailwindcss(),
  ],
});
