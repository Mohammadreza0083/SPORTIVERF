import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://sportiverf.com',
  trailingSlash: 'never',
  compressHTML: true,
  integrations: [tailwind()],

  // Internationalization Architecture Config
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    routing: {
      prefixDefaultLocale: true, // Force /en, /tr for clean architecture & SEO clarity
      redirectToDefaultLocale: false
    },
    fallback: {
      tr: 'en'
    }
  },

  // Image Strategy Engine
  image: {
    domains: ['cms.sportiverf.com', 'api.sportiverf.com'],
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  // Vite Configuration for enterprise path resolution & optimization
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/motion')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/@vercel/speed-insights')) {
              return 'vendor-insights';
            }
          }
        }
      }
    }
  }
});
