---
layout:   block
title:    "D3: Animating bars “going down”"
subtitle: "Confused by SVG's coordinate system origin being at the top-left corner?"
date:     2015-04-15 23:54:20 +0100
image:
  path:   /assets/images/bar.png
block:
  path:   animating-bars-going-down.html
adapted:
  publication: Block
tags:
  - Animation
  - D3
  - SVG
  - Interactive
---

One confusing aspect of animating bars (and working with SVG in general) is that the coordinate system origin is at the top-left corner, which means that `y` increases downwards.

One would expect that to animate a bar diminishing in size (“going down”) changing the `height` attribute would be all that's needed. However that's not true. This is a visual explanation of why it's necessary to animate both `y` and `height` attributes.

Another solution would be to surround the bar with a `clipPath` element and then transition the bar down. This way, everything on the inside of the clipping area is allowed to show through but everything on the outside is masked out.

This other approach would only work for a simple bar chart though. For a [more complex, animated stacked chart], animating both `y` and `height` attributes is the only solution.

[more complex, animated stacked chart]: https://bl.ocks.org/guilhermesimoes/8913c15adf7dd2cab53a
