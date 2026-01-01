---
layout:   block
title:    "D3: Encoding values as circles"
subtitle: "Avoid the mistake of using a linear scale with a circle radius."
date:     2016-10-23 13:53:17 +0100
image:
  path:   /assets/images/values-as-circles.png
block:
  path:   encoding-values-as-circles.html
adapted:
  publication: Block
tags:
  - DataViz
  - D3
  - Interactive
---

This gist demonstrates why it's a mistake to linearly map a data value to a circle radius.

Notice that in the first example, while `50` is only 2 times smaller than `100`, the circle that encodes the value `50` is _4 times_ smaller than the circle that encodes the value `100`. Even worse, while `10` is only 10 times smaller than `100`, the circle that encodes the value `10` is _100 times_ smaller than the circle that encodes the value `100`!

The occurrence of this mistake stems from 2 factors:

1. Misunderstanding how we visually interpret data.

   When we look at a [bar chart] we compare the length of each bar.
   When we look at a [waffle chart] we compare the number of squares of — or the area taken by — each category.
   Likewise, when we look at a [bubble chart] we compare the area of each bubble.

   Perceptually, we understand the overall amount of “ink” or pixels to reflect the data value.[^1]

2. Drawing an [SVG circle] requires a radius attribute.

   To draw an SVG circle, the `cx` and `cy` attributes are used to position the center of the element and the `r` attribute is used to define the radius of the element. It is this `r` attribute that makes it natural to assume a direct mapping between data value and circle radius.

But why does this mapping visually distort data?

Let's use two simple data values: `6` and `3`.
`6` is twice as large as `3` so the proportion between the two numbers is `2`.

Now, if we'll recall, the area of a circle equals pi times the radius squared, or `A = πr²`.

Applying part of this formula we square our values and get `36` and `9`.
Notice now that `36` is _4 times_ as large as `9` so the proportion between the two numbers changed from `2` to `4`.
(Multiplying each value by `π` won't change the proportion between them given that `π` is a constant.)

It is this change in proportion that leads to a misrepresentation of the data.

Since it is the quadratic function that is causing this, we need to counteract its effects by applying its inverse function — the square-root function.

If we square-root our values `36` and `9` we get `6` and `3` — right back where we started.
`6` is twice as large as `3` so the proportion between the two numbers remains `2`.

There are many ways to solve this issue in the D3 world, as evidenced in this gist, but the simplest one is to use a [square-root scale] to compute the appropriate circle radius.
This way the area of each circle is proportional to the data value it's representing.

[^1]: This is why [the US presidential election map is not only unhelpful but actually misleading]. A more perceptive and informative alternative is a [tilegram or hexagon tile grid map].

[bar chart]: https://observablehq.com/@d3/bar-chart
[waffle chart]: https://bl.ocks.org/XavierGimenez/8070956
[bubble chart]: https://observablehq.com/@d3/bubble-chart
[SVG circle]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle
[square-root scale]: https://medium.com/@mbostock/introducing-d3-scale-61980c51545f#8fa8
[the US presidential election map is not only unhelpful but actually misleading]: https://www.vox.com/2016/5/17/11686328/bad-election-map
[tilegram or hexagon tile grid map]: https://web.archive.org/web/20180817113218/http://pitchinteractive.com/latest/tilegrams-more-human-maps/
