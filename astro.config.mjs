// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import icon from 'astro-icon';

// Should come before mdx import
import AutoImport from 'astro-auto-import';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://new.laurentkempe.com',
  integrations: [
    tailwind(), 
    icon(),
    AutoImport({
      imports :[
        './src/components/Plyr.astro',
        './src/components/GitHubCard.astro',
        './src/components/Reveal.astro'
      ]
    }), 
    mdx()]
});