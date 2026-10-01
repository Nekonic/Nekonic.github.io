/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e1f22',       // IntelliJ editor main canvas
        secondary: '#2b2d30',     // IntelliJ tool window & sidebar
        card: '#26282d',          // IntelliJ card panel bg
        cardHover: '#2d3036',     // Hover state for cards
        border: '#393b40',        // JetBrains UI line border
        borderSubtle: '#2e3035',  // Subtle dividers
        borderActive: '#3574f0',  // IntelliJ focus border blue
        accent: {
          DEFAULT: '#3574f0',     // Signature IntelliJ Blue (Buttons, Active items)
          hover: '#3069d9',
          blue: '#3574f0',
          purple: '#7f52ff',     // JetBrains brand purple
          pink: '#f03a69',       // JetBrains brand pink
          orange: '#f48924',     // JetBrains brand amber
          green: '#57965c',      // IntelliJ success green
          cyan: '#2cd5c4',
        },
        text: {
          primary: '#dfe1e5',     // Main readable light text
          secondary: '#9da0a8',   // Muted gray
          muted: '#6f737a',       // Subtle metadata / line numbers
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
