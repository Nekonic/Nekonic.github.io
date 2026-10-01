/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#27282c',
          secondary: '#1e1f22',
          card: '#2b2d30',
        },
        accent: {
          DEFAULT: '#7b68ee',
          hover: '#6c5ce7',
        },
        text: {
          primary: '#bcbec4',
          secondary: '#6f737a',
        },
        border: '#393b40',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
