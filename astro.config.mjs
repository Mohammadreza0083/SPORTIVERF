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
    locales: ['en', 'tr', 'fa'],
    routing: {
      prefixDefaultLocale: true, // Force /en, /tr, /fa for clean architecture & SEO clarity
      redirectToDefaultLocale: false
    },
    fallback: {
      tr: 'en',
      fa: 'en'
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
      sourcemap: true,
      minify: 'esbuild',
      cssCodeSplit: true
    }
  }
});
