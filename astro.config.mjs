import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import remarkImageAlign from './src/lib/remark-image-align.mjs';

export default defineConfig({
  site: 'https://nekonic.github.io',
  output: 'static',
  integrations: [tailwind(), react()],
  markdown: {
    remarkPlugins: [remarkImageAlign],
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
});
