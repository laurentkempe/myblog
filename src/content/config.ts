// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `type` and `schema` for each collection
const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      permalink: z.string(),
      description: z.string().optional(),
      coverImage: z.string().optional(),
      coverCaption: z.string().optional(),
      image: z.object({
        url: z.string(),
        alt: z.string().optional()
      }).optional(),
      tags: z.array(z.string())
    })
});
// Export a single `collections` object to register your collection(s)
export const collections = {
  posts: postsCollection,
};