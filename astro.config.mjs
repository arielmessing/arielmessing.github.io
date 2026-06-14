// @ts-check
import {defineConfig} from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://arielmessing.github.io",
  integrations: [
    mdx(),
    sitemap({
      filter: page => !page.endsWith('/thanks') && !page.endsWith('/thanks/')
    })
  ],
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },
});