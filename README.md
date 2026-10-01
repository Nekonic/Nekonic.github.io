# Nekonic's Blog

Personal developer blog built with [Astro](https://astro.build) & Tailwind CSS, featuring JetBrains IDE-inspired dark theme.

🌐 **Website**: [https://nekonic.github.io](https://nekonic.github.io)

## Tech Stack
- **Framework**: [Astro 5](https://astro.build) (Static Site Generation)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (JetBrains Dark Palette)
- **Deployment**: GitHub Pages (via GitHub Actions)
- **Content**: Markdown Collections (`src/content/blog`, `src/content/tweets`)

## Features
- **JetBrains New UI Design**: Dark graphite tones, crisp typography (`Inter` + `JetBrains Mono`), sleek line icons.
- **Fast & Lightweight**: Zero client-side JS overhead for static posts.
- **Twitter-like Micro-blogging**: Dedicated `/compose` writing interface and live `/tweets` feed.
- **Private Memos**: Encrypted client-side sync with private repository (`Nekonic.github.io.data`).

## Local Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## License
[MIT](LICENSE.txt) © 2017-2026 Nekonic