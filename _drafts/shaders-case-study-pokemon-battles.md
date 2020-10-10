---
layout:   post
title:    <span class='nowrap'>Shaders Case Study:</span> <span class='nowrap'>Pokémon Battle Transitions</span>
subtitle: "Gotta shade 'em all"
date:     2020-10-06 00:16:53 +0100
image:
  path:   /assets/images/i-like-shorts2.gif
  alt:    "Gif from Pokémon Red, where a trainer challenges the main player and says 'I like shorts'."
  ratio:  ratio-game-boy
meta_image:
  path:   /assets/images/pokemon-textures/gold-first-grass.png
---

Remember the Pokémon games? I sure do! Just by looking at the gif above I can hear the sound a trainer makes when he spots you, and hear the battle chiptune beginning.

A while ago I watched a video that explained [how to use shaders to recreate the battle transitions seen in Pokémon] and other RPGs and I was **hooked**! I know next to nothing about game development but I knew I wanted to play with shaders and see what I could do.

[Last time I wrote about WebGL] I explained how to render a texture using [regl], so I won't go over that again. I'll use [the same vertex shader I used before] to render textures and then apply different fragment shaders to achieve these transitions:

{toc}

All of them follow this strategy:

```
result = doMathWithCoordinates(pixel)
if result < cutoff
  paintBlack
else
  paintColorFromTexture
```

A value called `cutoff` determines how far along the animation is.
As the `cutoff` increases, so does the number of pixels that enter the first condition branch, and so the more pixels are painted black.

In the UI slider you'll see throughout this post the `cutoff` goes from 0 to 100 but this value is scaled down so that inside each shader it goes from 0 to 1.

<div class="scene" data-texture-src="/assets/images/pokemon-textures/red-trainer.png" markdown="1">

# Left To Right Wipe

```cpp
void main() {
  if (uv.x < cutoff) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(texture, uv);
  }
}
```

<div>{%- include canvas-playground.html -%}</div>

Pretty simple. Each pixel's `x` coordinate (which goes from 0 to 1) is compared to the `cutoff`. The more the `cutoff` increases the more black pixels appear.
This kind of wipe was used prominently in the Star Wars films.
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/yellow-pikachu.png" markdown="1">

# Curtain Fall

```cpp
void main() {
  if (uv.y < cutoff) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(texture, uv);
  }
}
```

<div>{%- include canvas-playground.html -%}</div>

Same thing as the previous shader but now each pixel's `y` coordinate is compared against the `cutoff`.
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-bug-catching-grass.png" markdown="1">

# Vertical Center Join

```cpp
void main() {
  if (abs(uv.y - 0.5) * 2.0 > (1.0 - cutoff)) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(texture, uv);
  }
}
```

<div>{%- include canvas-playground.html -%}</div>

A little more complicated now. First, the image is centered in clip space with the `- 0.5`. Then the image is multiplied by `2` so that it covers the entire screen. Then `abs` is used to get the absolute value of all coordinates. Whenever you see an `abs` call, think of folding a piece of paper in 4:

<img src="/assets/images/folding-paper-in-4.png" />

All quadrants of the image now go from 0 to 1 whereas in uv space they went from 0 to 0.5 and 0.5 to 1, vertically and horizontally.

Finally, each manipulated pixel's `y` coordinate is compared with the `cutoff`. If the condition was `y < cutoff` the black area would expand from the middle of the screen. By changing the condition to `y > 1 - cutoff`, the black area expands from the top and the bottom.

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-gyarados.png" markdown="1">

# Fade To White

```cpp
void main() {
  vec4 white = vec4(1, 1, 1, 1);
  vec4 color = texture2D(texture, uv);
  gl_FragColor = mix(color, white, cutoff);
}
```

<div>{%- include canvas-playground.html -%}</div>

Here we mix with white.
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/rival-cave.png" markdown="1">

# Fade To Black

```cpp
void main() {
  vec4 color = texture2D(texture, uv);
  color.rgb = color.rgb * (1.0 - cutoff);
  gl_FragColor = color;
}
```

<div>{%- include canvas-playground.html -%}</div>

We multiply by the cutoff.
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/crystal-elite5.png" markdown="1">

# Cross Shape

```cpp
#define PI 3.1415926538

float getAngle(vec2 p){
  if (p.x > 0.0 || p.y != 0.0) {
    return 2.0 * atan(p.y / (length(p) + p.x));
  }
  return PI;
}

float quarterCircumference = 2.0 * PI * 1.0 / 4.0;
float rightAngle = radians(90.0);
void main() {
  float pAngle = mod(getAngle(uv - 0.5), rightAngle);
  float cutoffAngle = cutoff * quarterCircumference;
  if (pAngle < cutoffAngle) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(texture, uv);
  }
}
```

<div>{%- include canvas-playground.html -%}</div>

The concept for this transition was simple. Make the `cutoff` travel along a quarter circle. If the angle between a point and one of its quadrants' axis is smaller than this cutoff, paint it black.

It got complex _fast_. How do I calculate the perimeter of a circle? Right, 2πr. Oh, but there's no π constant in WebGL, I need to define it. How do I compute the angle between a point (x, y) and the positive x axis? [`atan`]. Oh, but I need it to be an angle between 0 and 2π. [`atan2`]. Oh, but there's no `atan2` in WebGL, I need to write it. And on and on.

In the end, for **_some_** reason the animation is going in a clockwise direction when it should be going in the opposite direction! I tried the same shader in a [shadertoy] and there it goes in an anticlockwise direction. I give up.
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-ho-oh.png" markdown="1">

# That's All Folks

```cpp
float maxRadius = sqrt(0.5 * 0.5 + 0.5 * 0.5);
void main() {
  float distanceMiddle = length(uv - 0.5);
  float radiusCutoff = (1.0 - cutoff) * maxRadius;
  if (distanceMiddle < radiusCutoff) {
    gl_FragColor = texture2D(texture, uv);
  } else {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
}
```

<div>{%- include canvas-playground.html -%}</div>

The idea for this transition was to measure the distance of each pixel to the center, and make the `cutoff` go from the maximum distance to the center to `0`.

Here I use the tricks I learned before. `- 0.5` to center the image in clip space. `length` to calculate the length of the vector. I also precompute the maximum radius so that it is not repeated for every pixel.

Such a cool effect, with only 10 lines of code!
</div>

<hr />

You may have noticed I did not implement the animation seen in the initial gif. That

<script type="text/javascript" src="/assets/js/vendor/regl-2.0.1.min.js"></script>
{%- include slider.html -%}


[how to use shaders to recreate the battle transitions seen in Pokémon]: https://www.youtube.com/watch?v=LnAoD7hgDxw
[Last time I wrote about WebGL]: 2020-10-06-regl-rendering-a-texture.md
[regl]: https://regl.party/
[the same vertex shader I used before]: 2020-10-06-regl-rendering-a-texture.md#vertex-shader
[`atan`]: https://en.wikipedia.org/wiki/Inverse_trigonometric_functions
[`atan2`]: https://en.wikipedia.org/wiki/Atan2
[shadertoy]: https://www.shadertoy.com/

https://www.shadertoy.com/view/MdySWD

https://barcinolechiguino.github.io/Camera-Transitions-Research/
