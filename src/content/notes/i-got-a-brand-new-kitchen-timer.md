---
title: "I Got a Brand New Kitchen Timer (an' I'll Give You the Key)"
description: "Upcycling a 2012 tablet into a 1990s oven timer using raw spite and the Web Audio API. Beep beep, beep beep."
date: 2026-07-10
tags: ["development"]
---

I've [lamented](keeping-up-with-the-times) recently the excruciating lack of timepieces in our new kitchen. A cook of the exact-measurement persuasion (remind me to tell how I once used my dad's fish-scales[^1] when baking at my parents'), moi, and I rebel against being forced to pull out my phone (yuck!) just to time 2.5 minutes for a poached egg.

[^1]: He uses them to weigh food for his fussy fish and general saltwater fauna.

The solution was staring at me, in the form of my wife's ancient Kindle® Fire™, from the heap of last-year's tech waiting to be upcycled. As a strong believer in the strict  minimalist's tenet of "the more uses an item has, the better," I am slowly warming up to the idea that some tools can only do one task -- but do it well. 

Preliminary approaches hit one annoying obstacle after another. The gizmo's basic OS (some highly restrictive version of Android 4, I suppose) barely managed to run an archaic version of the [Google Clock app](https://www.apkmirror.com/?sortby=date&sort=asc&s=google+clock) I had plucked from the depths of APKMirror. A version which, as it turned out, still hadn't introduced the new and exciting feature of _timer_.

My options thus limited, I was hindered again by the venerability of the resident Amazon Silk browser. It refused to run most modern kitchen timer web apps (how modern should 4 digits and a couple of buttons even be? You'll be surprised), presumably shocked by all these sleek new ES6 arrow functions. Not to mention the tendency of these web pages to gleefully slap a hideous ad[^2] on half of the tiny display. "Buy a real kitchen timer you scrooge!"

[^2]: Backwards compatibility to the Bronze Age. Also, splitting an infinitive is completely fine.

Essentially, what I needed was a single-page, zero-dependency web application that could run on an obsolete tablet. So I set out to write one. After all, to paraphrase the [great bard](https://en.wikipedia.org/wiki/Upstart_Crow), this is what I do!

Below are the glorious results (go ahead, set a timer!), with the journey following.

<iframe src="https://arielmessing.github.io/kitchen-timer/" loading="lazy" sandbox="allow-scripts"></iframe>

---

I wanted to mimic the interface of a physical 90s digital oven control panel, matching the one from our old kitchen. Sadly, in the few photos of it my archive produced, its display was either off -- or strategically obstructed, Austin Powers-style. So I had to rely on memory and intuition.

The display pane had four 7-segment digits, representing hours and minutes, and separated by a central colon. An indicator of the timer alarm was under the separator. I didn't want to rely on `.ttf` or `.woff` fonts, as legacy browsers may fail to load them from local file systems, instead rendering the elements using native inline SVG.

To the left of the display pane was a series of physical buttons (the purpose of some of which was never fully explored. A hand icon. Do not enter?). I focused on the three most crucial: an alarm bell button for controlling the timer/alarm, and a pair of plus (`+`) and minus (`-`) buttons. The trio went under the display pane, to make better use of the screen's height.

With the display looking authentic enough, I tried to recreate the timer's exact **BEEP-BEEP, BEEP-BEEP** alarm. (The oven had multiple alarm tones to choose from (!), reached by a sequence of cryptic button clicks; but early on I settled on this one, which was never replaced.) Loading `.mp3` or `.wav` files being considered risky and thus avoided, my aim was to synthesise the audio procedurally. As in, with code. Using _code_ to create _sound_. Mind-blowing. 

Zero (0) experience in audio engineering under my belt, I consulted with my favourite LLM, which nonchalantly produced the following specification:

> * **Synthesizer Profile:**
>    * **Waveform:** Sine wave (`osc.type = 'sine'`).
>    * **Frequency:** 1200Hz (simulates a throatier, retro magnetic appliance buzzer)[^3].
>    * **Gain Volume Envelope:** Peak value of 0.6 at startup, sustained for 150ms, then dropped via a linear ramp to 0 at 180ms to create a crisp, mechanical acoustic tail.
>    * **Single Note Duration:** Exactly 200 milliseconds absolute runtime per beep.
> * **Cadence Pattern (Double Pulse):** When the alarm state triggers, it executes a rhythmic pattern consisting of two bursts ("BEEP-BEEP"):
>    * **First Burst:** Begins instantly at `audioCtx.currentTime`.
>    * **Second Burst:** Explicitly scheduled on the audio timeline to begin exactly 250 milliseconds after the first burst.

[^3]: Eventually, real value was nowhere near that.

Waveform? Cadence? Acoustic tail? 90% of this <small>[citation needed]</small> sounds to me completely made up. But it turned out to be quite straightforward to implement. (Full [source code](https://github.com/arielmessing/kitchen-timer) is available for the truly bored.)

Mentioning the alarm state, we'd better discuss the state machine (too fancy a term here to describe how the application operates) -- which again, tried to recreate the original behaviour of the old oven timer.

There are three distinct, mutually exclusive states:

1. `CLOCK`: Default state. The display shows the current time (HH:MM), the colon separator blinks every 1 sec, `+` / `-` buttons are disabled. If the timer is actively running, the alarm bell indicator is ON. In the background, logic polls system time every 1,000ms.

2. `TIMER`: Countdown time (HH:MM) is shown on the display, with the colon solid ON. `+` / `-` buttons are enabled. In the background, it decrements total minutes every 60,000ms, and auto-reverts to CLOCK after 4 seconds of UI inactivity.

3. `ALARMING`: Timer value (`00:00`) is shown, again with the colon ON, and enabled `+` / `-` buttons. It triggers Web Audio API loop, and overrides all idle timeouts.

The interaction rules are somewhat self-explanatory:

The **alarm bell** button,
- in `CLOCK` state, switches to `TIMER` (initialised at `00:00`)
- in `TIMER` state, switches back to `CLOCK` (but does not cancel the running background timer)
- in `ALARMING` state, stops the audio, and resets to `CLOCK`.

The **plus** and **minus** buttons,
- are only active while in `TIMER` state
- increment/decrement timer by exactly 1 minute. (Time cannot be decremented below `00:00` because of science.)
- restart the 4-second auto-revert timeout, and
- reset the 60-second internal countdown interval, to ensure a full minute elapses after the last adjustment.

And just like the old oven, if the timer is actively running in the foreground and the `-` button is pressed to reach `00:00`, the system immediately jumps to `ALARMING` and triggers the audio beep sequence (useful for testing).

## Postscript

Prototype manually implemented (a standalone HTML file, JS and CSS inlined, stored locally on the device), I could easily tell that this is not a long-term solution: there's no way I could get the period syntax right all the time. Not to mention the reoccurring workarounds, like preventing screen timeout, or for hiding the browser UI.

Instead, I set up a vanilla [Vite](https://vite.dev/) development environment, and used its [legacy plugin](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) to target my web app to Android 4. Ah, and now I could write modern TypeScript code, instead of ~~cuneiform~~ pre-ES6 JS.

Some [GitHub Actions](https://github.com/features/actions) magic later, the code is built and deployed on their Pages platform (just like this website!).

Et voilà. An obvious case of the [IKEA effect](https://en.wikipedia.org/wiki/IKEA_effect), but I can't help feeling chuffed.
