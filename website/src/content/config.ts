import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  blog: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      author: z.string().default('Cortex TMS Team'),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
  }),
};
