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

export const collections = { notes };
