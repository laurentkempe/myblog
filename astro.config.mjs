// @ts-check
import { defineConfig } from 'astro/config';
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
  integrations: [
    icon(),
    AutoImport({
      imports :[
        './src/components/GitHubCard.astro',
        './src/components/Alert.astro',
        './src/components/Reveal.astro',
        {
          '@astro-community/astro-embed-twitter': ['Tweet'],
          '@astro-community/astro-embed-youtube': ['YouTube'],
          'astro:assets': ['Image']
        }
      ]
    }), 
    mdx(),
    sitemap()]
});
