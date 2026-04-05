---
title: "Framing the Cube"
description: "A look at how I slipped an old p5.js sketch into a note using nothing but plain Markdown and a 30-year-old HTML tag."
date: 2026-04-03
---

Many a day ago, I experimented with generative art using <a href="https://p5js.org/" target="_blank">p5.js</a>. 

One of my earliest projects was what I'll henceforth refer to as 'a basic 3D renderer'[^1]. It wasn't anything fancy -- just a wireframe cube and some matrix math -- but it felt like a small universe I'd built from scratch. 

Fast forward to right here, right now, when naturally I wondered: *Could it be imported into a note without breaking everything?*

When you work with frameworks like Astro, the temptation is to turn everything into a component. ("Off with Markdown! We now write in .mdx!") Instead, I found that the oldest trick in the book is still the best: 

**The `<iframe>`.**

<iframe src="https://arielmessing.github.io/basic-3d-projection/" 
    width="100%" 
    height="400px" 
    loading="lazy" 
    sandbox="allow-scripts"></iframe>

***

*Cough.* A short history lesson.

Introduced by Microsoft in Internet Explorer 3.0 in 1996, the iframe ("inline frame") fundamentally changed web architecture by allowing developers to embed one HTML document inside another without refreshing the entire page.

Eventually it won out over the standard `<frame>` and `<frameset>` tags as it could be placed *anywhere* within a normal page flow, thus offering far greater flexibility.[^2]

*"Anywhere," we said?*

Indeed. By hosting my sketch as a standalone page on GitHub (much like this website itself), I could simply cut a "window" into it from this note. No library conflicts, no CSS leaks, and no complicated build steps.

It turns out that sometimes the best way to move forward is to use a tool that's been around since the 90s. It's not about the math of the 3D cube anymore; it’s about the fact that it's here, spinning in the middle of my thoughts.

[^1]: More accurately, a projection engine (converting 3D coordinates to 2D); p5.js has a built-in WEBGL mode.

[^2]: Over the years, its reputation has been a rollercoaster: iframes were the backbone of early "mashups" and third-party widgets (think Google Maps or YouTube embeds), but also became a notorious vector for clickjacking and <a href="https://en.wikipedia.org/wiki/Cross-site_scripting" target="_blank">cross-site scripting (XSS)</a> attacks. Modern web standards like HTML5 eventually rehabilitated the element by introducing the sandbox attribute, providing the security controls necessary to keep it relevant in an era of complex web applications and micro-frontends.