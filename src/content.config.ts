import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod"

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    revised: z.optional(z.coerce.date()),
    tags: z.array(z.string()).default([]),

  }).refine(data => !data.revised || data.revised >= data.date, {
    path: ["revised"],
    message: "Must be the same as or later than the original date",
  }),
});

const tags = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tags" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { notes, tags };
