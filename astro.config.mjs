import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import remarkImageAlign from './src/lib/remark-image-align.mjs';
import remarkCodeExtras from './src/lib/remark-code-extras.mjs';
import jetbrainsDark from './src/lib/shiki-jetbrains-dark.json' with { type: 'json' };

export default defineConfig({
  site: 'https://nekonic.github.io',
  output: 'static',
  integrations: [tailwind(), react()],
  markdown: {
    remarkPlugins: [remarkImageAlign, remarkCodeExtras],
    shikiConfig: {
      theme: jetbrainsDark,
    },
  },
});
