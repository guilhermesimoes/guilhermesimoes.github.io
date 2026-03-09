---
layout:   block
title:    "The Importance Of <span class='nowrap'>(The Main Thread)</span> Being Idle"
subtitle: "Or The Importance Of Being Worker."
date:     2026-03-28 08:57:09 +0000
image:
  path:   /assets/images/squares.png
  alt:    "Four colorful squares."
block:
  path:   web-worker/index.html
tags: [Perf, Web, JavaScript, Interactive]
---

[Mandatory listening for this post].

The browser's main thread is responsible for _everything_: running JavaScript, handling user input, laying out the page and painting the screen. It can only do one thing at a time. So when JavaScript keeps it busy everything else grinds to a halt.

Give the demo a try. Hit **Work** and see that most animations stop immediately, scrolling stops working (in some browsers), and all interactive elements (buttons, text fields, etc.) become unresponsive. The main thread is busy and has no time for you.

Now hit **Work inside worker** and see that all the animations keep running and the interactive elements keep being, well, interactive. It may seem like nothing is happening, but all the work is occurring inside a [Web Worker] -- a separate thread with its own JavaScript runtime. The main thread doesn't even notice and keeps running smoothly.

---

If you want to understand how Web Workers work, I encourage you to look at the code. It's about 30 lines of JavaScript. The entire Web Worker API is quite simple: [`postMessage`] to send and a [`message`] event listener to receive.

I added logs so you can open your browser's devtools and see the conversation between the two threads play out as you click each button. If you refresh the page, you'll also see the main thread creating the worker and the worker announcing it's ready.

As for the animations, the key point is that some animations keep running despite the main thread being blocked because their properties use hardware acceleration. The spinning square uses the `transform` property, which is GPU-accelerated. The fading square uses the `opacity` property, which is also GPU-accelerated. The moving square is **incorrectly** animated using the `left` and `top` properties, which are not GPU-accelerated. A correct animation should use the `transform: translate(x, y)` property instead.
The color-changing square uses a combination of the `background-color` property and a custom property (`--hue`), which I was expecting to be GPU-accelerated, but aparently it is not.

Reading [How to create high-performance CSS animations] should help you understand when an animation uses hardware acceleration. And [CSS Triggers] is a great resource for information on which properties trigger layout, paint and composite steps. But this is another topic.

---

Workers can't touch the DOM, but they can do everything else: fetch data, crunch numbers, parse large files, run algorithms. Anything CPU-intensive that would otherwise jank your UI is a good candidate to move to a worker. Reserve the main thread for what only it can do: handling user input and rendering the UI.

Keep the main thread idle, and your page will feel fast and smooth.

[Mandatory listening for this post]: https://www.youtube.com/watch?v=jySfU10IQu4&t=17s
[Web Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Worker
[`postMessage`]: https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
[`message`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event
[How to create high-performance CSS animations]: https://web.dev/articles/animations-guide
[CSS Triggers]: https://css-triggers.com/
