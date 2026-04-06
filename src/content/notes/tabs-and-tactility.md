---
title: "Tabs and Tactility"
description: "Moving away from forced navigation toward a browsing experience that respects the reader's wrist and the honest agency of the 'Back' button."
date: 2026-04-06
---

I have been weighing the morality of external links.

For a time, I felt it necessary to consign them into new tabs when they appear in these notes. The intent was to preserve the "flow" of the prose, preventing the hypothetical reader from being whisked away by a stray reference. (I know I can be.[^1]) It was a protective gesture.

I began by eschewing native, limited, yet elegant Markdown syntax -- brace of brackets, pair of parentheses -- in favour of raw HTML `<a>` tags with `target="_blank"` set. It was clunky but, alas, *noblesse oblige*. 

Later, discovering (and understanding) the security risks involved, it made sense to use those tags with caution.[^2] 

I began drafting a small plugin to automate this manual labour.[^3] But mid-script, the realization took hold: as I aimed for a 'print on paper' quality, that prescribed path became an intrusion. 

In a physical book, a footnote or a reference is a choice made by the reader. A book does not force your eyes to move; it merely provides an invitation. By insisting on a new tab, I was essentially grabbing the reader's wrist.

There is also the matter of the "Back" button: perhaps the most honest piece of navigation ever designed. To break it is to break the trust of the medium.

Instead of going against the grain of a static, document-focused site, I am returning to the browser's native simplicity: external links will now respect the reader's agency. My plugin never made it into source control.[^4]

(I am still debating whether to signal the transition in some subtle way: e.g., a dotted underline for external destinations. Better than the digital noise of icons. A quiet hint; a peek through a window rather than a push through a door.)

Modern browsers are remarkably adept at remembering one's place, as well. I am trusting the cache: the return journey via the "Back" button is now nearly as instant as the turning of a page.

A link should be an invitation, not an automation.

[^1]: I know I can have an abundance of stray references.

[^2]: Known as "[tabnabbing](https://en.wikipedia.org/wiki/Tabnabbing)," this security risk allows a newly opened page to use JavaScript to redirect the original tab to a malicious URL (by changing `window.opener`). Using `rel="noopener noreferrer"` in `<a>` tags ensures the new page has no relationship with the one that opened it (though most modern browsers now implicitly apply noopener to all relevant links by default as a safety measure).

[^3]: Sitting at the point ('rehype') where Astro traverses the HTML tree parsed from a Markdown file, it captures nodes representing external links and adds the right properties to the `<a>` tag.

[^4]: "The best code is no code at all" --Jeff Atwood