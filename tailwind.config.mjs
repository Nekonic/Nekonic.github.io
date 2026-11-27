/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // 색은 global.css의 테마 변수(--rgb-*)에서 옴: 어두운 테마 = JetBrains Islands Dark, 밝은 테마 = Islands Light
        ground: 'rgb(var(--rgb-ground) / <alpha-value>)',          // IDE window frame (toolbar, stripes, status bar)
        frameHover: 'rgb(var(--rgb-frame-hover) / <alpha-value>)',
        frameActive: 'rgb(var(--rgb-frame-active) / <alpha-value>)',
        primary: 'rgb(var(--rgb-primary) / <alpha-value>)',        // Island / editor canvas
        secondary: 'rgb(var(--rgb-secondary) / <alpha-value>)',    // Raised controls inside islands
        card: 'rgb(var(--rgb-card) / <alpha-value>)',
        cardHover: 'rgb(var(--rgb-card-hover) / <alpha-value>)',
        border: 'rgb(var(--rgb-border) / <alpha-value>)',
        borderSubtle: 'rgb(var(--rgb-border-subtle) / <alpha-value>)',
        borderHover: 'rgb(var(--rgb-border-hover) / <alpha-value>)',
        borderActive: '#3574f0',
        tab: { DEFAULT: 'rgb(var(--rgb-tab) / <alpha-value>)', border: 'rgb(var(--rgb-tab-border) / <alpha-value>)' }, // 선택된 에디터 탭
        accent: {
          DEFAULT: '#3574f0',     // Signature IntelliJ Blue (Buttons, Active items)
          hover: '#3069d9',
          soft: 'rgb(var(--rgb-accent-soft) / <alpha-value>)', // Accent for text on the theme ground
          blue: '#3574f0',
          purple: '#7f52ff',
          pink: '#f03a69',
          orange: '#f48924',
          green: '#57965c',
          cyan: '#2cd5c4',
        },
        syntax: {
          keyword: 'rgb(var(--rgb-syn-keyword) / <alpha-value>)',
          string: 'rgb(var(--rgb-syn-string) / <alpha-value>)',
          number: 'rgb(var(--rgb-syn-number) / <alpha-value>)',
          key: 'rgb(var(--rgb-syn-key) / <alpha-value>)',
          func: 'rgb(var(--rgb-syn-func) / <alpha-value>)',
          hash: 'rgb(var(--rgb-syn-hash) / <alpha-value>)',
        },
        text: {
          strong: 'rgb(var(--rgb-fg-strong) / <alpha-value>)', // 제목 (어두운 테마에선 흰색에 가까움)
          primary: 'rgb(var(--rgb-fg) / <alpha-value>)',
          body: 'rgb(var(--rgb-fg-2) / <alpha-value>)',
          secondary: 'rgb(var(--rgb-fg-3) / <alpha-value>)',
          muted: 'rgb(var(--rgb-fg-muted) / <alpha-value>)',
          faint: 'rgb(var(--rgb-fg-faint) / <alpha-value>)',
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
