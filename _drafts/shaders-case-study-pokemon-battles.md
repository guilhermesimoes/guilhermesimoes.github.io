---
layout:   post
title:    <span class='nowrap'>Shaders Case Study:</span> <span class='nowrap'>Pokémon Battle Transitions</span>
subtitle: "Gotta shade 'em all"
date:     2020-10-06 00:16:53 +0100
image:
  path:   /assets/images/i-like-shorts2.gif
  alt:    "Gif of Pokémon Crystal where Suicune appears in a random encounter."
  ratio:  ratio-game-boy
---

Remember the Pokémon games? I sure do! I can even hear the sound


I'm pretty new to vector graphics. I tried playing a bit with WebGL but... WebGL is _hard_. [This post] explains it better than I can.

REGL is… too magical. It also implements a fully functional paradigm. Which means it works wonderfully when the use case is providing certain inputs (data & shaders) and expecting one output (a rendered image).

REGL abstractions work well, but I want to be able to add/remove attributes from a vertex buffer, not re-create the whole buffer from an input Array. I want something with lower-level access to data structures. I want to update uniforms, not to provide uniform-returning callback functions.

REGL is too high-level for me.

In this primer, we will use regl, a library that allows us to use WebGL in a more friendly way. It is a WebGL library for drawing in immediate mode, i.e., you must use drawing commands containing geometry and attributes, but can manage webgl's state a bit more easily without learning the native API.

All these examples follow the same strategy. They transform a texture according to a value called `cutoff`. In the UI you'll see throughout this post the `cutoff` will go from 0 to 100 but inside the shaders this value will go from 0 to 1.

{toc}

<div class="shaders">
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

</div>

<script type="text/javascript" src="/assets/js/regl-2.0.1.min.js"></script>
{%- include slider.html -%}

Inspired by https://www.youtube.com/watch?v=LnAoD7hgDxw

https://www.shadertoy.com/view/MdySWD

https://stackoverflow.com/questions/34443968/how-can-i-apply-a-pixel-shader-to-a-canvas-element

https://barcinolechiguino.github.io/Camera-Transitions-Research/
