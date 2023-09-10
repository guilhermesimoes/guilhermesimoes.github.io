---
layout:   block
title:    "YouTube's new morphing play/pause SVG icon"
subtitle: "Use D3 transitions to morph one SVG path into another."
date:     2016-01-21 23:43:57 +0100
image:
  path:   /assets/images/play-button.png
block:
  path:   youtube-new-morphing-play-pause-svg-icon.html
adapted:
  publication: Block
---
As soon as I saw the new YouTube Player and its new morphing play/pause button, I wanted to understand how it was made and replicate it myself.

From my analysis it looks like YouTube is using [SMIL animations]. I could not get those animations to work on browsers other than Chrome and it appears [that they are deprecated and will be removed]. I settled for the following technique:

1. Define the icon `path` elements inside a `defs` element so that they are not drawn.

2. Draw one icon by defining a `use` element whose `xlink:href` attribute points to one of the `path`s defined in the previous step. Simply [changing this attribute to point to the other icon is enough to swap them out], but this switch is not animated. To do that,

3. Replace the [`use`] with the actual `path` when the page is loaded.

4. Use [`d3-interpolate-path` to morph] one `path` into the other when the button is clicked. Other SVG libraries like D3, Snap.svg or Raphaël can also be used for this effect.

Finally, it's important to point out that the number and order of the points of each `path` affect the way in which they morph into one another. If a `path` is drawn clockwise and another is drawn anticlockwise or if they are not drawn using the exact same number of points, animations between them will not look smooth. This is the reason the play button — a triangle — is drawn using 8 points instead of just 3. There's definitely more to be said on this subject.

[SMIL animations]: https://css-tricks.com/guide-svg-animations-smil/
[that they are deprecated and will be removed]: https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/5o0yiO440LM%5B1-25%5D
[changing this attribute to point to the other icon is enough to swap them out]: https://codepen.io/chriscoyier/pen/BaxRaM
[`use`]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use
[`d3-interpolate-path` to morph]: https://github.com/pbeshai/d3-interpolate-path
