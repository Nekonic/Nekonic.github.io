import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    layout: z.string().optional()
  })
});

const tweets = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tweets" }),
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date().optional(),
    layout: z.string().optional()
  })
});

export const collections = { blog, tweets };
