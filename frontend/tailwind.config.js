/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1221',
        'ink-raised': '#111A30',
        paper: '#F3F6FC',
        'paper-dim': '#E6ECF7',
        graphite: '#152238',
        slate: {
          DEFAULT: '#5B6B8C',
          200: '#D3DCEC',
          700: '#2A3A5C',
        },
        amber: {
          DEFAULT: '#2F6FED',
          dim: '#1D47A6',
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
