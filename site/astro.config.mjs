import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://beautifier.aidalabs.kr',
  integrations: [mdx(), sitemap()],
  build: {
    format: 'directory',
  },
  compressHTML: true,
  vite: {
    worker: {
      format: 'es',
    },
  },
});
