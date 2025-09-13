/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dex-bg': '#0a0a0f',
        'dex-card': '#111118',
        'dex-border': '#1a1a2e',
        'dex-accent': '#8b5cf6',
        'dex-accent-light': '#a78bfa',
        'dex-success': '#10b981',
        'dex-danger': '#ef4444',
        'dex-warning': '#f59e0b',
        'dex-text': '#e5e7eb',
        'dex-text-muted': '#9ca3af',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
