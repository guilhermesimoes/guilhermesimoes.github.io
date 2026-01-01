---
layout:   block
title:    "Animating a pirate treasure map path"
subtitle: “X” marks the spot.
date:     2023-09-10 16:36:40 +0100
image:
  path:   /assets/images/treasure-map.png
block:
  path:   animating-a-pirate-treasure-map-path.html
tags:
  - Animation
  - SVG
  - Interactive
---

Animating an SVG line is nothing to write home about. It has already been described in great detail [many], [multiple], [different][different] [times][times]. We make the line use dashes, configure it so that there is a single dash that spans the entire line, and then we animate the offset of that dash. Done.

But what if we want to animate a line that itself is dashed? Like a dashed line in a treasure map?

As it turns out, we can animate it in pretty much the same way! But instead of animating the dashed line, we mask that dashed line with an identical line, and then we animate _that_ line. So, step by step:

1. Define the line `path` inside a `defs` element so that it's not drawn.

2. Draw the line by defining a [`use`] element whose `xlink:href` attribute points to the `path` defined in the previous step.

3. Create a mask with an identical line by using another `use` element. The mask must be white ([like in Photoshop]) and have the same `stroke` properties ([`stroke-width`], [`stroke-linecap`], [`stroke-miterlimit`], etc) as the drawn line so that it can cover it perfectly.

4. Make the mask line use dashes, make it dashed with a single dash that spans its total length, and then animate the dash offset. The usual stuff.

Finally, we can change the transition timing function to achieve different results. Using the [steps transition function] with the same amount of steps as the number of line dashes results in a nice effect.

[many]: https://jakearchibald.com/2013/animated-line-drawing-svg/
[multiple]: https://css-tricks.com/svg-line-animation-works/
[different]: https://product.voxmedia.com/2013/11/25/5426880/polygon-feature-design-svg-animations-for-fun-and-profit
[times]: https://tympanus.net/codrops/2013/12/30/svg-drawing-animation/
[`use`]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use
[like in Photoshop]: https://lab.iamvdo.me/css-svg-masks/#masking
[`stroke-width`]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width
[`stroke-linecap`]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
[`stroke-miterlimit`]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
[steps transition function]: https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function#values
