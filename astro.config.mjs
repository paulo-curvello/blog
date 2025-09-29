// astro.config.mjs
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://dev.paulocurvello.com",
  base: "/",
  trailingSlash: "ignore",
  integrations: [mdx(), sitemap()],
});
