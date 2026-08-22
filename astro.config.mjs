// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from "@tailwindcss/vite";
import icon from 'astro-icon';
// Should come before mdx import
import AutoImport from 'astro-auto-import';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://laurentkempe.com',
  markdown: {
    // astro-auto-import currently only supports the unified Markdown processor,
    // so keep using it instead of the new default Sätteri processor introduced in Astro 7.
    processor: unified(),
  },
  integrations: [
    icon(),
    AutoImport({
      imports :[
        './src/components/GitHubCard.astro',
        './src/components/Alert.astro',
        './src/components/Reveal.astro',
        './src/components/GiscusComments.astro',
        {
          '@astro-community/astro-embed-twitter': ['Tweet'],
          '@astro-community/astro-embed-bluesky': ['BlueskyPost'],
          '@astro-community/astro-embed-youtube': ['YouTube'],
          'astro:assets': ['Image']
        }
      ]
    }), 
    mdx(),
    sitemap()]
});
