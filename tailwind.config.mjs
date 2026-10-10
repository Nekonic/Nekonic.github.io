/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ground: '#151618',        // IDE window ground (behind islands)
        primary: '#1e1f22',       // Island / editor canvas
        secondary: '#2b2d30',     // Raised controls inside islands
        card: '#232427',          // Card / code header panel
        cardHover: '#2b2d30',     // Hover state for cards
        border: '#393b40',        // JetBrains UI line border
        borderSubtle: '#2b2d30',  // Subtle dividers
        borderHover: '#4e5157',   // Hovered border
        borderActive: '#3574f0',  // IntelliJ focus border blue
        accent: {
          DEFAULT: '#3574f0',     // Signature IntelliJ Blue (Buttons, Active items)
          hover: '#3069d9',
          soft: '#8cb4f0',        // Accent for text on dark ground
          blue: '#3574f0',
          purple: '#7f52ff',     // JetBrains brand purple
          pink: '#f03a69',       // JetBrains brand pink
          orange: '#f48924',     // JetBrains brand amber
          green: '#57965c',      // IntelliJ success green
          cyan: '#2cd5c4',
        },
        syntax: {
          keyword: '#cf8e6d',
          string: '#6aab73',
          number: '#2aacb8',
          key: '#c77dbb',
          func: '#56a8f5',
          hash: '#e0b85a',
        },
        text: {
          primary: '#dfe1e5',     // Main readable light text
          body: '#bcbec4',        // Article body
          secondary: '#9da0a8',   // Muted gray
          muted: '#868a91',       // Metadata (keeps 4.5:1 on islands)
          faint: '#6f737a',       // Decorative only (line numbers, ##)
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
