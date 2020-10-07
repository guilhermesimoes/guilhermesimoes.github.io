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

Last time I wrote about OpenGL I explained how to correctly render a texture using [regl], so I won't go over that again. I'll use the same vertex shader I used previously to render textures and then apply different fragment shaders to achieve different transitions.

All these examples follow the same strategy. They transform a texture according to a value called `cutoff`. In the UI slider you'll see throughout this post the `cutoff` goes from 0 to 100 but this value is scaled down so that inside each shader it goes from 0 to 1.

{toc}

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
  return acos(dot(normalize(p), vec2(1, 0)));
}

vec2 rotate(vec2 p, float phi) {
  return vec2(
    dot(vec2(+cos(phi), -sin(phi)), p),
    dot(vec2(+sin(phi), +cos(phi)), p)
  );
}

void main() {
  float quarterCircumference = 0.5 * PI * cutoff;
  vec2 p = vec2(cos(quarterCircumference), sin(quarterCircumference));

  vec2 centeredUv = uv - 0.5;
  if (
      (centeredUv.x < 0.0 && centeredUv.y < 0.0) ||
      (centeredUv.x > 0.0 && centeredUv.y > 0.0)
    ) {
    centeredUv = rotate(centeredUv, radians(90.0));
  }
  if (getAngle(abs(centeredUv)) < getAngle(p)) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(texture, uv);
  }
}
```

<div>{%- include canvas-playground.html -%}</div>

This one got complex
There are probably way more efficient ways to do this.
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

https://www.shadertoy.com/view/MdySWD

https://barcinolechiguino.github.io/Camera-Transitions-Research/
