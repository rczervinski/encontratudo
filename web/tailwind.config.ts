import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed', // purple-600
          dark: '#6d28d9',     // purple-700
        },
        bg: {
          DEFAULT: '#ffffff',
          card: '#f6f7fb',
          secondary: '#f1f5f9',
        },
        text: {
          primary: '#1f2937',   // gray-800
          secondary: '#6b7280', // gray-500
        }
      },
      boxShadow: {
        glow: '0 0 30px rgba(124,58,237,0.25)',
        glowStrong: '0 0 50px rgba(124,58,237,0.45)'
      }
    },
  },
  plugins: [],
}
export default config
