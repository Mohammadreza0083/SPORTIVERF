/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A0A0A',
          dark: '#111111',
          surface: '#FFFFFF',
          elevated: '#FAF9F6',
          white: '#FFFFFF',
          muted: '#666666',
          dim: '#888888',
          borderSubtle: '#E5E3DC',
          borderMedium: '#D1CEC5',
          borderStrong: '#A39F93',
        },
        luxury: {
          gold: '#C5A059',
          goldDark: '#9E7B3B',
          goldLight: '#E6C887',
          cream: '#FAF9F6',
          softBg: '#F4F3EF',
          charcoal: '#0D0D0D',
          border: '#E5E3DC',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Outfit', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        vazir: ['Vazirmatn', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.8s infinite linear',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
