// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
import { glob } from 'astro/loaders';
// Define a `type` and `schema` for each collection
const posts = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      permalink: z.string(),
      description: z.string().optional(),
      coverImage: z.string().optional(),
      thumbnailImage: z.string().optional(),
      coverCaption: z.string().optional(),
      image: z.object({
        url: z.string(),
        alt: z.string().optional()
      }).optional(),
      tags: z.array(z.string())
    })
});
const presentations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/speaking' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    permalink: z.string(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()),
    slides: z.string().optional()
  })
});

// Export a single `collections` object to register your collection(s)
export const collections = {
  posts, presentations
};