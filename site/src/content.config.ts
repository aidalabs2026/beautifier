import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!**/_*.{md,mdx}'],
    base: './src/content/guides',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['basics', 'format-guide', 'troubleshooting', 'comparison', 'strategy', 'faq']),
    lastUpdated: z.coerce.date(),
    order: z.number().optional(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
  }),
});

const glossary = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '!**/_*.md'],
    base: './src/content/glossary',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    related: z.array(z.string()).optional(),
    lastUpdated: z.coerce.date(),
  }),
});

const faq = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '!**/_*.md'],
    base: './src/content/faq',
  }),
  schema: z.object({
    question: z.string(),
    category: z.enum(['using-the-tool', 'privacy', 'limits', 'formats', 'ads']),
    order: z.number().optional(),
  }),
});

export const collections = { guides, glossary, faq };
