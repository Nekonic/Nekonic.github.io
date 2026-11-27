import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import remarkImageAlign from './src/lib/remark-image-align.mjs';
import remarkCodeExtras from './src/lib/remark-code-extras.mjs';
import remarkPdfEmbed from './src/lib/remark-pdf-embed.mjs';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import jetbrainsDark from './src/lib/shiki-jetbrains-dark.json' with { type: 'json' };
import jetbrainsLight from './src/lib/shiki-jetbrains-light.json' with { type: 'json' };

export default defineConfig({
  site: 'https://nekonic.github.io',
  output: 'static',
  integrations: [tailwind(), react()],
  markdown: {
    remarkPlugins: [remarkImageAlign, remarkCodeExtras, remarkPdfEmbed, remarkMath],
    rehypePlugins: [rehypeKatex], // $...$ 수식
    // 코드 색: 어두운 테마는 JetBrains Dark, 밝은 테마는 JetBrains Light (global.css가 --shiki-light로 바꿈)
    shikiConfig: {
      themes: { dark: jetbrainsDark, light: jetbrainsLight },
      defaultColor: 'dark',
    },
  },
});
