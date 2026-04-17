---
title: "Tags, Tags, and Tags"
description: "A wary glance at the growing archive reveals the chaos of a cluttered drawer; finding the discipline to apply labels discreetly before the thread is lost."
date: 2026-04-17
tags: ["design", "typography", "minimalism", "meta"]
---

Approaching my first baker's dozen of notes, I saw an opportunity to introduce tagging support.[^1]

[^1]: Alongside documenting note revisions -- though I am still weighing how best to present those.

From a purely technical perspective, the implementation was straightforward. The schema for the Markdown files was enriched with a new optional field, and its content -- an array of plain strings -- diffused to the components responsible for displaying content, whether listed or expanded.

However, when it came to visualising these tags, the challenge deepened.

In a website aspiring for minimalism, design is about hierarchy as much as aesthetics. Specific semantic and visual clues ensure that metadata -- date, tags, or perhaps distinct categories in the future -- supports the main content without competing for the reader's attention.

The invisible logic of semantic architecture[^2] will have to wait for a future note; for now, the focus is on preventing tags from drawing the eye away from the title or the prose. They should be discoverable, but not distracting.

[^2]: How to make code literate and use page structure to tell machines -- search engines, screen readers -- exactly what the tags are for. In other words: why a `<nav>` inside a `<footer>`, inside an `<article>`, inside a `<main>`.

Across the site, I already employ *typographic contrast* to create a visual divide:

* **Serif** is immersive, slow, and artistic; I use it for the "reading" experience.
* **Sans-serif** is fast, functional, and somewhat clinical; used for labelling, navigation, and metadata.
* **Monospace** is mechanical and literal; dedicated to code.

This shift in voice signals to the eye that the narrative has ended and the technical data has begun. It prevents the page from becoming a monolithic wall of text.

Following this logic, tags are treated as metadata. On a single note page, they are a navigation tool -- exiled to be a quiet whisper at the bottom. In the notes list, however, where every item is a link, their purpose shifts to a *thematic label*.

To prevent information density, I've opted to show only the primary tag in the list view. By forcing a single, high-level categorisation (e.g., #history or #nature), the reader can scan the page without their eyes snagging on a cloud of keywords. It maintains a consistent vertical rhythm.

In the end, it is an exercise in restraint. The goal isn't to build a complex library system, but to ensure that as these notes accumulate, they remain a coherent collection rather than a cluttered drawer. I hope it will provide just enough structure to be useful, without the noise that usually follows a growing archive.

**Tag, you're it!**

<small>N.B.</small> -- Incorporating said new feature into my existing Article component required adding this most droll line of code:

```astro
{tags && <Tags tags={tags} />}
```