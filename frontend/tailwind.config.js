/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1116',
        'ink-raised': '#161A22',
        paper: '#F6F5F1',
        'paper-dim': '#ECEAE3',
        graphite: '#1B1F27',
        slate: {
          DEFAULT: '#6B7280',
          200: '#D8DBE0',
          700: '#3A3F4B',
        },
        amber: {
          DEFAULT: '#FFB020',
          dim: '#9A6B14',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
}
