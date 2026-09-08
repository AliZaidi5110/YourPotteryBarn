import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#C4613A',
          dark: '#A04E2D',
          light: '#F0C4A8',
          pale: '#FDF0E8',
        },
        clay: {
          DEFAULT: '#5C3D2E',
          light: '#8B6147',
          lighter: '#B8916E',
        },
        sage: {
          DEFAULT: '#4A7C59',
          light: '#7AAB88',
          pale: '#C8DED1',
          dark: '#2D5A3D',
        },
        cream: {
          DEFAULT: '#FAF7F0',
          dark: '#F0EAD6',
          darker: '#E8DCC8',
        },
        parchment: '#E8DCC8',
        'warm-white': '#FFFDF9',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'pottery': '16px',
        '2xl': '20px',
        '3xl': '32px',
      },
      boxShadow: {
        'pottery-sm': '0 1px 3px rgba(92,61,46,0.08), 0 1px 2px rgba(92,61,46,0.06)',
        'pottery':    '0 4px 16px rgba(92,61,46,0.10), 0 2px 6px rgba(92,61,46,0.06)',
        'pottery-lg': '0 8px 32px rgba(92,61,46,0.14), 0 4px 12px rgba(92,61,46,0.08)',
        'pottery-xl': '0 20px 60px rgba(92,61,46,0.18)',
        'terracotta': '0 4px 16px rgba(196,97,58,0.3)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.6s ease forwards',
        'spin-slow':  'spin 3s linear infinite',
        'pulse-soft': 'pulse 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'pottery-gradient': 'linear-gradient(135deg, #C4613A 0%, #A04E2D 100%)',
        'sage-gradient':    'linear-gradient(135deg, #4A7C59 0%, #2D5A3D 100%)',
        'cream-gradient':   'linear-gradient(180deg, #FAF7F0 0%, #F0EAD6 100%)',
        'clay-gradient':    'linear-gradient(135deg, #5C3D2E 0%, #3D2218 100%)',
        'warm-gradient':    'linear-gradient(135deg, #FAF7F0 0%, #E8DCC8 100%)',
      },
    },
  },
  plugins: [],
}

export default config
