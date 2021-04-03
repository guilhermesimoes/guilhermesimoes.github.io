---
layout:   block2
title:    "D3: Animating bars “going down”"
subtitle: "Confused by SVG's coordinate system origin being at the top-left corner?"
date:     2015-04-15 23:54:20 +0100
image:
  path:   /assets/images/bar.png
adapted:
  publication: Block
  url:    https://bl.ocks.org/guilhermesimoes/be6b8be8a3e8dc2b70e2
---

<div class="post-content wrapper mb-1" itemprop="articleBody" markdown="1">

One confusing aspect of animating bars (and working with SVG in general) is that the coordinate system origin is at the top-left corner, which means that `y` increases downwards.

One would expect that to animate a bar diminishing in size (“going down”) changing the `height` attribute would be all that's needed. However that's not true. This is a visual explanation of why it's necessary to animate both `y` and `height` attributes.

Another solution would be to surround the bar with a `clipPath` element and then transition the bar down. This way, everything on the inside of the clipping area is allowed to show through but everything on the outside is masked out.

This other approach would only work for a simple bar chart though. For a [more complex, animated stacked chart][1], animating both `y` and `height` attributes is the only solution.

</div>

<div class="bleed mb-1 gist" markdown="1">

```html
<!DOCTYPE html>
<meta charset="utf-8">
<style>
html, body {
    height: 100%;
    margin: 0;
}

.chart-container {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    padding: 15px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.controls {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 15px;
    left: 15px;
}

@media screen and (min-width: 310px) {
    .controls {
        display: block;
        bottom: initial;
        top: 15px;
    }
}

.chart {
    width: 100%;
    height: 100%;
    overflow: visible;
}

.chart path,
.chart line,
.chart rect {
    shape-rendering: crispEdges;
}

.chart .bar {
    fill: steelblue;
}

.chart .baseline {
    fill: none;
    stroke: black;
}
</style>
<body>

<div class="chart-container js-chart-container">
    <form class="controls js-controls">
        <label><button type="button" value="height">Animate height</button></label>
        <label><button type="button" value="y">Animate y</button></label>
        <label><button type="button" value="both">Animate y and height</button></label>
    </form>
    <svg class="chart js-chart"></svg>
</div>

<script src="https://d3js.org/d3.v5.min.js"></script>
<script type="text/javascript">
"use strict";

var container = { width: 1000, height: 500 },
    margin = { top: 60, right: 0, bottom: container.height / 6, left: 0 },
    width = container.width - margin.left - margin.right,
    height = container.height - margin.top - margin.bottom,
    animationDuration = 400,
    barWidth = 40,
    barX = (width - barWidth) / 2,
    toggling = true;

var svg = d3.select(".js-chart")
    .attr("viewBox", "0 0 " + container.width + " " + container.height);

var mainContainer = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = mainContainer.append("rect")
    .attr("class", "bar")
    .attr("x", barX)
    .attr("y", 0)
    .attr("width", barWidth)
    .attr("height", height);

mainContainer.append("line")
    .attr("class", "baseline")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height)
    .attr("y2", height);

var buttons = d3.selectAll(".js-controls button");
buttons.on("click", toggleBar);

function toggleBar() {
    if (toggling) {
        hideBar(this.value);
        buttons.attr("disabled", "disabled");
        d3.select(this).attr("disabled", null);
    } else {
        showBar(this.value);
        buttons.attr("disabled", null);
    }
    toggling = !toggling;
}

function hideBar(togglingMode) {
    var transition = bar.transition().duration(animationDuration);

    switch (togglingMode) {
    case "height":
        transition.attr("height", 0);
        break;
    case "y":
        transition.attr("y", height);
        break;
    case "both":
        transition.attr("y", height).attr("height", 0);
        break;
    }
}

function showBar(togglingMode) {
    var transition = bar.transition().duration(animationDuration);

    switch (togglingMode) {
    case "height":
        transition.attr("height", height);
        break;
    case "y":
        transition.attr("y", 0);
        break;
    case "both":
        transition.attr("y", 0).attr("height", height);
        break;
    }
}
</script>
</body>
```

</div>

[1]: https://bl.ocks.org/guilhermesimoes/8913c15adf7dd2cab53a
