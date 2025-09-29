// astro.config.mjs
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  // mude aqui:
  trailingSlash: 'ignore', // aceita /pt e /pt/
  integrations: [mdx(), sitemap()],
});
