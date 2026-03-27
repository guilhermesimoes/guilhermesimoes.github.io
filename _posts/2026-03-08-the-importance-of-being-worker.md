---
layout:   block
title:    "The Importance Of (The Main Thread) Being Idle"
subtitle: "Or The Importance Of Being Worker."
date:     2026-03-27 19:12:09 +0000
image:
  path:   /assets/images/todo.png
  alt:    "TODO."
block:
  path:   web-worker/index.html
tags: [Perf, Web, JavaScript, Interactive]
---

[Mandatory listening for this post].

The browser's main thread is responsible for _everything_: running JavaScript, handling user input, laying out the page and painting pixels to the screen. It can only do one thing at a time. So when JavaScript keeps it busy everything else grinds to a halt.

Give the demo a try. Hit **Work** and watch what happens: most animations will stop immediately, scrolling will stop working (in some browsers), and all interactive elements (buttons, text fields, etc.) will become unresponsive. The main thread is busy and has no time for you.

Now hit **Work inside worker** and watch what happens: all the animations keep running and the interactive elements keep being, well, interactive. It may seem like nothing is happening, but all the work is occurring inside a [Web Worker] -- a separate thread with its own JavaScript runtime. The main thread doesn't even notice and keeps running smoothly.

---

If you want to understand how Web Workers work, I encourage you to look at the code. It's about 30 lines of JavaScript. The entire Web Worker API is very simple: [`postMessage`] to send and a [`message`] event listener to receive.

I added logs so you can open your browser's devtools and see the conversation between the two threads play out as you click each button. If you refresh the page, you'll also see the main thread creating the worker and the worker announcing it's ready.

As for the animations, the key point is that some animations keep running despite the main thread being blocked because their properties use hardware acceleration. The spinning square uses the  `transform` property, which is GPU-accelerated. The fading square uses the  `opacity` property, which is also GPU-accelerated (but for some reason not on Firefox!). The moving square is incorrectly animated using the `left` and `top` properties, which are not GPU-accelerated. To correctly animate it we should use the `transform: translate(x, y)` property instead.
The coloring square uses a combination of the `background-color` property and  `--hue` custom property, which I was expecting to be GPU-accelerated, but aparently it is not.

Reading [How to create high-performance CSS animations] should give you more context for understanding these concepts. I also recommend checking [CSS Triggers] for more information on which properties trigger layout, paint and composite steps.

---

Workers can't touch the DOM, but they can do everything else: fetch data, crunch numbers, parse large files, run algorithms. Anything CPU-intensive that would otherwise jank your UI is a good candidate to move to a worker. Reserve the main thread for what only it can do: handling user input and painting the UI.

Keep the main thread idle, and your page will feel fast and smooth.

[Mandatory listening for this post]: https://www.youtube.com/watch?v=jySfU10IQu4&t=17s
[Web Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Worker
[`postMessage`]: https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
[`message`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event
[How to create high-performance CSS animations]: https://web.dev/articles/animations-guide
[CSS Triggers]: https://css-triggers.com/
