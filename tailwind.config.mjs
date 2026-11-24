/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // JetBrains Islands Dark: 창 바탕(ground)이 밝고, 그 위에 떠 있는 섬(primary)이 더 어두움
        ground: '#24282c',        // IDE window frame (toolbar, stripes, status bar)
        frameHover: '#32363b',    // Hovered button on the frame
        frameActive: '#484a4d',   // Pressed tool window button on the frame
        primary: '#181a1c',       // Island / editor canvas
        secondary: '#2a2c30',     // Raised controls inside islands
        card: '#1f2124',          // Card / code header panel
        cardHover: '#26292c',     // Hover state for cards
        border: '#393b40',        // JetBrains UI line border
        borderSubtle: '#26282b',  // Subtle dividers
        borderHover: '#4e5157',   // Hovered border
        borderActive: '#3574f0',  // IntelliJ focus border blue
        tab: { DEFAULT: '#233458', border: '#3a5282' }, // 선택된 에디터 탭 (Islands: 파란 알약)
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
        // 영문·기호는 JetBrains Mono, 한글은 Pretendard. 합자(!= → ≠ 등)는 끔
        mono: [['"JetBrains Mono"', '"Pretendard Variable"', 'Pretendard', 'ui-monospace', 'monospace'], { fontFeatureSettings: '"liga" 0, "calt" 0' }],
      },
    },
  },
  plugins: [],
}
