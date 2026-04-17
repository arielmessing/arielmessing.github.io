---
title: "Putting the 'Post' in Postbox"
description: "Moving away from the noise of web forms toward a digital interaction that feels like a human gesture."
date: 2026-04-02
revised: 2026-04-16
tags: ["design", "minimalism", "meta"]
---

Most "Contact Me" pages are loud. 

They are filled with validation shakes, complex responsiveness, and bright green *"Success!"* banners. (Seriously, see the default [Success / Thank You Page](https://docs.web3forms.com/getting-started/customizations/success-thank-you-page) of my contact form provider of choice, Web3Forms.)

When I set out to build the contact page for my site, I wanted the opposite: something that feels as tactile and calm as dropping a physical letter into a postbox slot.

The goal was to strip away the "web-ness" of the interaction. No floating labels or heavy borders. After all, the form is just a few simple fields followed by a "send" -- ~~and even the submit button is disguised (as a link).~~

A big challenge in minimal design is handling success without a change of atmosphere. I briefly considered conditional logic and state management, but those felt noisy. 

Eventually, I removed everything redundant, leaving just a few words:

>Thanks. I’ve received your message, and will be in touch soon

Instead of a "Return" button there is a simple signature: @arielmessing. A link, but a sign-off as well. It makes a human gesture out of a navigation requirement.

In the end, the best interface doesn't present the most features; it's the one that simply gets out of the way.

## Postscript

I've changed my mind completely vis-à-vis disguising the submit button as a link. [Buttons are not links](https://balsamiq.com/blog/button-design-best-practices/#3-buttons-are-not-links): "treating them like they are is a fast way to confuse" anyone just trying to send a message. The next 'Best Practices' list I read might convince me otherwise, but for now, the button remains -- clear, quiet, and fundamentally a button.