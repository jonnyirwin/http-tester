/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'app-bg': '#1e1e1e',
        'app-sidebar': '#252526',
        'app-panel': '#2d2d2d',
        'app-border': '#3c3c3c',
        'app-text': '#cccccc',
        'app-text-muted': '#808080',
        'app-accent': '#0078d4',
        'app-accent-hover': '#1e90ff',
        'status-success': '#4ec9b0',
        'status-redirect': '#dcdcaa',
        'status-client-error': '#f14c4c',
        'status-server-error': '#ce9178',
      }
    },
  },
  plugins: [],
}
