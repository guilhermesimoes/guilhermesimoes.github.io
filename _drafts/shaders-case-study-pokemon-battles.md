---
layout:   post
title:    <span class='nowrap'>Shaders Case Study:</span> <span class='nowrap'>Pokémon Battle Transitions</span>
subtitle: "Gotta shade 'em all"
date:     2020-10-04 00:16:53 +0100
image:
  path:   /assets/images/i-like-shorts.gif
  alt:    "Gif of Pokémon Crystal where Suicune appears in a random encounter."
  ratio:  ratio-game-boy
---

Remember the Pokémon games? I sure do! I can even hear the sound


I'm pretty new to vector graphics. I tried playing a bit with WebGL but... WebGL is _hard_. [This post] explains it better than I can.

REGL is… too magical. It also implements a fully functional paradigm. Which means it works wonderfully when the use case is providing certain inputs (data & shaders) and expecting one output (a rendered image).

REGL abstractions work well, but I want to be able to add/remove attributes from a vertex buffer, not re-create the whole buffer from an input Array. I want something with lower-level access to data structures. I want to update uniforms, not to provide uniform-returning callback functions.

REGL is too high-level for me.

In this primer, we will use regl, a library that allows us to use WebGL in a more friendly way. It is a WebGL library for drawing in immediate mode, i.e., you must use drawing commands containing geometry and attributes, but can manage webgl's state a bit more easily without learning the native API.

<div class="shaders">
  <div class="scene" data-texture-src="/assets/images/shaders-case-study-pokemon-battles/textures/1-red-trainer.png">
    <div markdown="1">

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

</div>
    {%- include canvas-playground.html -%}
  </div>

  <div class="scene" data-texture-src="/assets/images/shaders-case-study-pokemon-battles/textures/2-yellow-pikachu.png">
    <div markdown="1">

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

</div>
    {%- include canvas-playground.html -%}
  </div>

  <div class="scene" data-texture-src="/assets/images/shaders-case-study-pokemon-battles/textures/3-gold-grass.png">
    <div markdown="1">

# End Of Chapter (Vertical Join Center)

```cpp
void main() {
  if (0.5 - abs(uv.y - 0.5) < abs(cutoff) * 0.5) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(texture, uv);
  }
}
```

</div>
    {%- include canvas-playground.html -%}
  </div>

  <div class="scene" data-texture-src="/assets/images/shaders-case-study-pokemon-battles/textures/4-gold-gyarados.png">
    <div markdown="1">

# Ascension (Fade To White)

```cpp
void main() {
  vec4 white = vec4(1, 1, 1, 1);
  vec4 color = texture2D(texture, uv);
  gl_FragColor = mix(color, white, cutoff);
}
```

</div>
    {%- include canvas-playground.html -%}
  </div>

  <div class="scene" data-texture-src="/assets/images/shaders-case-study-pokemon-battles/textures/5-rival-cave.png">
    <div markdown="1">

# Death (Fade To Black)

```cpp
void main() {
  vec4 color = texture2D(texture, uv);
  color.rgb = color.rgb * (cutoff * -1.0 + 1.0);
  gl_FragColor = color;
}
```

</div>
    {%- include canvas-playground.html -%}
  </div>

  <div class="scene" data-texture-src="/assets/images/shaders-case-study-pokemon-battles/textures/6-ho-oh2.png">
    <div markdown="1">

# That's All Folks

```cpp
float radius = sqrt(2.0);
void main() {
  float distanceMiddle = sqrt((uv.x - 0.5) * (uv.x - 0.5) + (uv.y - 0.5) * (uv.y - 0.5)) * 2.0;
  float radiusCutoff = (1.0 - cutoff) * radius;
  if (distanceMiddle < radiusCutoff) {
    gl_FragColor = texture2D(texture, uv);
  } else {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
}
```

</div>
    {%- include canvas-playground.html -%}
  </div>

</div>

<script type="text/javascript" src="/assets/js/regl-2.0.1.min.js"></script>
{%- include slider.html -%}

[This post]: https://ivan.sanchezortega.es:444/devel/2019/02/14/a-rant-about-webgl-frameworks.html#a-rant-about-the-webgl-api

Inspired by https://www.youtube.com/watch?v=LnAoD7hgDxw

https://www.shadertoy.com/view/MdySWD

https://stackoverflow.com/questions/34443968/how-can-i-apply-a-pixel-shader-to-a-canvas-element

https://barcinolechiguino.github.io/Camera-Transitions-Research/
