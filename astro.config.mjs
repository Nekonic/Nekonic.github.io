import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://nekonic.github.io',
  output: 'static',
  integrations: [tailwind(), react()],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
});
