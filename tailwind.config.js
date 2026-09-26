/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          soft: 'var(--primary-soft)',
          foreground: 'var(--primary-foreground)',
        },
        accent: 'var(--accent)',
        danger: 'var(--danger)',
        udhaar: {
          DEFAULT: 'var(--udhaar)',
          soft: 'var(--udhaar-soft)',
        },
        wasooli: {
          DEFAULT: 'var(--wasooli)',
          soft: 'var(--wasooli-soft)',
        },
        warning: 'var(--warning)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-poppins)', 'sans-serif'],
      },
      boxShadow: {
        'fintech': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'fintech-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.08)',
        'glow-primary': '0 8px 24px -4px rgba(37, 99, 235, 0.35)',
        'glow-udhaar': '0 8px 24px -4px rgba(225, 29, 72, 0.35)',
        'glow-wasooli': '0 8px 24px -4px rgba(16, 185, 129, 0.35)',
      },
    },
  },
  plugins: [],
};
