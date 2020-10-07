---
layout:   post
title:    <span class='nowrap'>Shaders Case Study:</span> <span class='nowrap'>Pokémon Battle Transitions</span>
subtitle: "Gotta shade 'em all"
date:     2020-10-06 00:16:53 +0100
image:
  path:   /assets/images/i-like-shorts2.gif
  alt:    "Gif from Pokémon Red, where a trainer challenges the main player and says 'I like shorts'."
  ratio:  ratio-game-boy
---

Remember the Pokémon games? I sure do! By looking at the gif above I can even hear the sound a trainer makes when he spots you, and hear the battle chiptune beginning.

A while ago I watched a video that explained [how to use shaders to recreate the battle transitions seen in Pokémon] and other RPGs and I was **hooked**! I know next to nothing about game development but I knew I wanted to play with shaders just to see what I could do.

Last time I wrote about OpenGL I explained how to correctly render a texture using [regl], so I won't go over that again. I'll use the same vertex shader I used previously to render textures and then apply different fragment shaders to achieve these transitions:

{toc}

All of them follow the same strategy. They paint a texture according to a value called `cutoff`, like this:
```
result = calculateSomethingByLookingAtCoordinates(pixel)
if result < cutoff
  renderBlack
else
  renderTexture
```

In the UI slider you'll see throughout this post the `cutoff` goes from 0 to 100 but this value is scaled down so that inside each shader it goes from 0 to 1.

<div class="scene" data-texture-src="/assets/images/pokemon-textures/1-red-trainer.png" markdown="1">

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

Here we are just checking the pixel's x coordinate against the cutoff value.
This kind of wipe was used prominently in the Star Wars films.

As the cutoff value increases, so do the number of pixels that
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/2-yellow-pikachu.png" markdown="1">

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

Here we are doing something similar to the previous shader. We're just checking the pixel's y coordinate against the cutoff value.
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/3-gold-grass.png" markdown="1">

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

asd asd
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/4-gold-gyarados.png" markdown="1">

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

<div class="scene" data-texture-src="/assets/images/pokemon-textures/5-rival-cave.png" markdown="1">

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

<div class="scene" data-texture-src="/assets/images/pokemon-textures/elite5.png" markdown="1">

# Cross Shape

```cpp
#define PI 3.1415926538

float getAngle(vec2 p){
  if (p.x > 0.0 || p.y != 0.0) {
    return 2.0 * atan(p.y / (length(p) + p.x));
  }
  return PI;
}

void main() {
  float quarterCircumference = 0.5 * PI * cutoff;
  vec2 p = vec2(cos(quarterCircumference), sin(quarterCircumference));
  float cutoffAngle = getAngle(p);
  float pAngle = mod(getAngle(uv - 0.5), radians(90.0));
  if (pAngle < cutoffAngle) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(texture, uv);
  }
}
```

<div>{%- include canvas-playground.html -%}</div>

The concept for this one was simple. Make the cutoff value travel along a quarter circle. If the angle between a point and one of its quadrants' axis is smaller than this cutoff, paint it black.

It got complex _fast_. How do I calculate the perimeter of a circle? Right, 2πr. Oh, but there's no π constant in WebGL, I need to define it. How do I compute the angle between a point (x, y) and the positive x axis? [`atan`]. Oh, but I need it to be an angle between 0 and 2π. [`atan2`]. Oh, but there's no `atan2` in WebGL, I need to write it. And on and on.

Finally, for **_some_** reason the animation is going in a clockwise direction when it should be going in the opposite direction! I tried the same shader in a [shadertoy] and there it goes in an anticlockwise direction. I give up.
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/6-ho-oh2.png" markdown="1">

# That's All Folks

```cpp
float radius = sqrt(2.0);
void main() {
  float distanceMiddle = length(uv - 0.5) * 2.0;
  float radiusCutoff = (1.0 - cutoff) * radius;
  if (distanceMiddle < radiusCutoff) {
    gl_FragColor = texture2D(texture, uv);
  } else {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
}
```

<div>{%- include canvas-playground.html -%}</div>

measure the distance of each pixel to the center
Looney Tunes
</div>

notice I did not implement the animation see in the gif
that will be done in the next post

<script type="text/javascript" src="/assets/js/vendor/regl-2.0.1.min.js"></script>
{%- include slider.html -%}


[how to use shaders to recreate the battle transitions seen in Pokémon]: https://www.youtube.com/watch?v=LnAoD7hgDxw
[regl]: https://regl.party/
[`atan`]: https://en.wikipedia.org/wiki/Inverse_trigonometric_functions
[`atan2`]: https://en.wikipedia.org/wiki/Atan2
[shadertoy]: https://www.shadertoy.com/

https://www.shadertoy.com/view/MdySWD

https://barcinolechiguino.github.io/Camera-Transitions-Research/
