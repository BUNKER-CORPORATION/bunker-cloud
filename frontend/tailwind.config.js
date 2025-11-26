/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#111827',
            p: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            h1: {
              fontWeight: '700',
              fontSize: '1.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h2: {
              fontWeight: '700',
              fontSize: '1.25rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            h3: {
              fontWeight: '700',
              fontSize: '1.125rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            strong: {
              fontWeight: '700',
            },
            ul: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            ol: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
