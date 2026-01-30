import { defineCollection, z } from 'astro:content'
import { docsSchema } from '@astrojs/starlight/schema'

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
      heroImage: z.string().optional(),
      heroAlt: z.string().optional(),
    }),
  }),
  homepage: defineCollection({
    schema: z.discriminatedUnion('type', [
      // Hero section
      z.object({
        type: z.literal('hero'),
        title: z.string(),
        subtitle: z.string(),
        tagline: z.string(),
        description: z.string(),
        primaryButton: z.object({
          text: z.string(),
          href: z.string(),
          variant: z.enum(['neon', 'prism']).default('neon'),
        }),
        secondaryButton: z
          .object({
            text: z.string(),
            href: z.string(),
            variant: z.enum(['neon', 'prism']).default('prism'),
          })
          .optional(),
      }),
      // Feature card
      z.object({
        type: z.literal('feature'),
        icon: z.enum(['flame', 'shield', 'bar-chart', 'file-text', 'key', 'zap']),
        title: z.string(),
        order: z.number(),
      }),
      // Step card
      z.object({
        type: z.literal('step'),
        number: z.number(),
        title: z.string(),
      }),
      // Installation section
      z.object({
        type: z.literal('installation'),
        commands: z.array(
          z.object({
            label: z.string(),
            code: z.string(),
            recommended: z.boolean().default(false),
          })
        ),
      }),
      // Pillar card
      z.object({
        type: z.literal('pillar'),
        icon: z.enum(['trending-up', 'shield', 'leaf']),
        title: z.string(),
        description: z.string(),
        order: z.number(),
        beforeMetric: z.object({
          label: z.string(),
          value: z.string(),
          barWidth: z.string(),
        }),
        afterMetric: z.object({
          label: z.string(),
          value: z.string(),
          barWidth: z.string(),
        }),
        impactText: z.string(),
      }),
      // Blockquote
      z.object({
        type: z.literal('blockquote'),
        author: z.string(),
      }),
      // CTA Box
      z.object({
        type: z.literal('cta'),
        title: z.string(),
        description: z.string(),
        primaryButton: z.object({
          text: z.string(),
          href: z.string(),
        }),
        secondaryButton: z.object({
          text: z.string(),
          href: z.string(),
        }).optional(),
      }),
    ]),
  }),
}
