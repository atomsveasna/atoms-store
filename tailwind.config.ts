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
        // Atoms brand palette
        brand: {
          DEFAULT: '#0A0F1E',
          50:  '#EEF1FF',
          100: '#D4DBFF',
          200: '#AAB6FF',
          300: '#7F91FF',
          400: '#4F6BFF',
          500: '#1A3FFF',
          600: '#0030DD',
          700: '#0025AA',
          800: '#001A77',
          900: '#0A0F1E',
        },
        accent: {
          DEFAULT: '#00E5FF',
          dim: '#00B8CC',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F7F8FC',
          muted: '#EEF1F8',
          dark: '#0D1221',
        },
        ink: {
          DEFAULT: '#0A0F1E',
          soft: '#3D4466',
          muted: '#7B82A0',
          faint: '#B8BCCF',
        },
        success: '#00C48C',
        warning: '#FFB020',
        danger:  '#FF4D4F',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(10,15,30,0.06), 0 4px 16px rgba(10,15,30,0.04)',
        'card-hover': '0 4px 12px rgba(10,15,30,0.10), 0 16px 40px rgba(10,15,30,0.08)',
        'glow': '0 0 40px rgba(0,229,255,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
