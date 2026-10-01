/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e1f22',       // IntelliJ editor main bg
        secondary: '#2b2d30',     // IntelliJ tool window / sidebar bg
        card: '#26282d',          // JetBrains card bg
        cardHover: '#2f3137',     // Hover state for cards
        border: '#393b40',        // JetBrains UI line border
        borderHover: '#4e5157',
        accent: {
          DEFAULT: '#7f52ff',     // JetBrains vibrant purple
          hover: '#9872ff',
          blue: '#3574f0',        // JetBrains blue
          cyan: '#2cd5c4',
        },
        text: {
          primary: '#dfe1e5',     // Main readable light text
          secondary: '#9da0a8',   // Muted gray
          muted: '#6f737a',       // Line numbers / subtle metadata
        },
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
