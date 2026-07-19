---
title: Scribes and Schemas in Tag Epigraphs
description: Bringing the classic aesthetic of the epigraph to note taxonomies using Astro’s Content Layer API
date: 2026-07-15
tags: [development, astro, meta]
---

Consider the opening of my [Notes](/notes) list: this self-deprecating [statement](https://essentiels.bnf.fr/fr/image/37e6cae1-a114-46a8-a93d-32c1d855c7ad-seneque-lettres-lucilius) "in ornate capital letters,"[^1] by layman scribe Ragambertus, has been my Twitter bio since time immemorial. 

![A manuscript of the letters of Seneca, with the scribe's note, 'Ragambertus, just a no-account layman with a beard, wrote this text.'](image.jpg)

[^1]: Michael Pye's fascinating _**The Edge of the World**: How The North Sea Made Us Who We Are_, is one of several works from which I translated excerpts, added visuals and context, and regularly posted on that challenging medium. The book is still on my easy-to-reach shelf.

Or consider the quote from Tolkien's letter at the epigraph on my About page. Or the [runner-up](/notes/taxonomy-can-make-your-head-spin) for my Tags list's header. My point is, I like the aesthetics of epigraphs[^2], and wanted that aesthetic extended to particular tags.

[^2]: Not to mention, seriously appreciate a good quote.

For each relevant single page (About, Notes, etc.) I created a Markdown file, which I then statically imported in their .astro file.

```typescript
/* src/pages/about.astro */

import * as aboutMD from '../content/about.md';
const { title, description } = aboutMD.frontmatter;
const { Content } = aboutMD;
```

Since tags are dynamically generated from notes metadata, I didn't want to (and probably couldn't) manually write static imports in the Tag Route [tag].astro file. The best (and most "Astro native") way I could find to handle this was to manage tag files as an Astro Content Collection. 

(The alternative, via Vite's Glob Imports,

```typescript
const tagFiles = 
  import.meta.glob<MarkdownInstance<Record<string, any>>>(
    "/src/tags/*.md", { 
      eager: true 
    });
```

while potentially great if no formal schema is required -- as is my case -- seemed verbose yet limiting.)

### 1. Set up Content Directory

I created a folder structure where tag .md files live, matching the tag names exactly:

```
src/content/
      ├── notes/  <-- Existing notes collection
      └── tags/   <-- New tag collection
            ├── etymology.md
            └── typography.md
```

### 2. Define Tags Collection

I created a new tag collection in `src/content.config.ts`. Beyond configuring the loader (a strict requirement since Astro 5), this allows for setting up frontmatter specifically for tags -- like a custom title, icon, or description.

```typescript
/* src/content.config.ts */

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod"

const notes = defineCollection({ 
  /* ...existing notes loader and schema... */
});

const tags = defineCollection({
  loader: glob({ 
    pattern: "**/*.md", 
    base: "./src/content/tags" 
  }),

  /* optional schema */
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

export const collections = { notes, tags };

```

### 3. Query and Render

When generating tag pages in the Tag Route `[tag].astro`, I used the `getEntry` function from astro:content to fetch the specific .md file matching the current tag name. 

And here's the best thing: there's no need for me to create a .md file for every tag. Not on day one, at least. If a tag doesn't have a matching file (yet?), Astro will gracefully return `undefined`. Then I can easily use an `if` block (or optional chaining) in the HTML part to check if the entry exists. If it does, render its custom frontmatter and Markdown content; if it doesn't, gracefully fall back to a default layout.

```typescript jsx
/* src/pages/tags/[tag].astro */

import { getEntry, render } from "astro:content";

// ...logic for generating a static path for every tag...

// Load the corresponding tag markdown file. 
// Note: Astro collection lookups are case-sensitive to 
// the filename.
const tagEntry = await getEntry('tags', tag);

// Compile the tag Markdown file if it exists
const renderResult = tagEntry ? await render(tagEntry) : null;
const Content = renderResult ? renderResult.Content : null;

// ...

// Optionally use metadata from frontmatter
<h1>Posts tagged with "{ tagEntry?.data.title || tag }"</h1>
{ tagEntry?.data.description && 
  <p class="tag-description">{ tagEntry.data.description }</p> 
}

// Tag's markdown file content, if existing, is rendered here:
{ Content && 
  <div class="tag-epigraph">
    <Content />
  </div> 
}
```

(Back to sifting through quotes collections, I suppose.)