// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from 'astro-icon';
// Should come before mdx import
import AutoImport from 'astro-auto-import';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://new.laurentkempe.com',
  integrations: [
    icon(),
    AutoImport({
      imports :[
        './src/components/Plyr.astro',
        './src/components/GitHubCard.astro',
        './src/components/Alert.astro',
        './src/components/Reveal.astro',
        {
          '@astro-community/astro-embed-twitter': ['Tweet'],
          'astro:assets': ['Image']
        }
      ]
    }), 
    mdx()]
});