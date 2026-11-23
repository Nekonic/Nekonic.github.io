import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import remarkImageAlign from './src/lib/remark-image-align.mjs';
import remarkCodeExtras from './src/lib/remark-code-extras.mjs';
import remarkPdfEmbed from './src/lib/remark-pdf-embed.mjs';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import jetbrainsDark from './src/lib/shiki-jetbrains-dark.json' with { type: 'json' };

export default defineConfig({
  site: 'https://nekonic.github.io',
  output: 'static',
  integrations: [tailwind(), react()],
  markdown: {
    remarkPlugins: [remarkImageAlign, remarkCodeExtras, remarkPdfEmbed, remarkMath],
    rehypePlugins: [rehypeKatex], // $...$ 수식
    shikiConfig: {
      theme: jetbrainsDark,
    },
  },
});
