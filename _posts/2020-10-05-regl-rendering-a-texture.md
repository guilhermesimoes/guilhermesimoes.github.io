---
layout:   post
title:    "regl: Rendering a Texture"
subtitle: "If you're new to WebGL, give regl a try."
date:     2020-10-05 23:51:29 +0100
image:
  path:   /assets/images/pokemon-textures/crystal-pokemon-snorlax.png
scripts:
  - vendor/regl-2.0.1.min.js
---

I'm pretty new to vector graphics. I tried playing with WebGL for a bit but... WebGL is _hard, man_. [This post] explains it better than I can. Luckily, searching for [npm packages tagged with "WebGL"] yielded a very interesting library: [regl]. regl abstracts WebGL with a simple, intuitive API, somewhat [inspired by React]. Right up my alley.

This post is not an attempt to explain how OpenGL or shaders work. There are [far][far] [better][better] [options][options] out there. I'm merely documenting my own progress. In this post I'll detail the two shaders required to render a texture.

# Fragment Shader

```cpp
precision mediump float;
uniform sampler2D texture;
varying vec2 uv;

void main() {
  gl_FragColor = texture2D(texture, uv);
}
```
{: .fragment-shader}

This shader is straightforward. It reads from a texture and sets each pixel color to the same value as the texture color.
`precision` determines how much precision the GPU uses when calculating floats. Other possible values are `lowp` and `highp`.

# Vertex Shader

Rendering a texture was easy. Figuring out how to render it _where_ I wanted was the hard part. I expected this to work:

<div class="scene" data-texture-src="/assets/images/pokemon-textures/crystal-pokemon-snorlax.png" markdown="1">

```cpp
precision mediump float;
attribute vec2 position;
varying vec2 uv;

void main () {
  uv = position;
  gl_Position = vec4(uv, 0, 1);
}
```
{: .vertex-shader}

But this is the result:

<noscript>
  You'll need to enable Javascript to see this section, sorry! canvas and WebGL depend on it.
</noscript>
<div class="aspect-ratio-box ratio-game-boy mb-1">
  <canvas class="aspect-ratio-box-content"></canvas>
</div>

Erhm, very cool looking in a [glitch art] kind of way, but not what I wanted.

The key point to understand here is that textures have no concept of "up". The coordinates `(0,0)` reference the first pixel of the texture and the coordinates `(1,1)` reference the last pixel of the texture.

OpenGL on the other hand uses a different coordinate system. The domain of the "clip space" goes from `-1` to `1` horizontally and from `1` to `-1` vertically. This image can explain it better than I can:

<img src="/assets/images/texture-vs-clip-space.png" />

As for the 3 glitched quadrants of the clip space, I suppose OpenGL takes pixels from the edges of the painted quadrant and uses them to fill the other 3.
</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/crystal-pokemon-snorlax.png" markdown="1">

The solution is some math, of course:

<div class="vertex-shader" markdown="1">

```cpp
precision mediump float;
attribute vec2 position;
varying vec2 uv;

vec2 normalizeCoords(vec2 position) {
  // Center in clip space
  // Convert from 0->1 to -0.5->+0.5
  vec2 centered = position - 0.5;

  // Increase texture in size so that it covers the entire screen
  // Convert from -0.5->+0.5 to -1->1
  vec2 full = centered * 2.0;

  // Flip y
  return full * vec2(1, -1);
}

void main () {
  uv = position;
  gl_Position = vec4(normalizeCoords(position), 0, 1);
}
```

</div>

And there it is! Finally, in all its glory.

<noscript>
  Again, sorry, you'll need to enable Javascript if you want to see it!
</noscript>
<div class="aspect-ratio-box ratio-game-boy mb-1">
  <canvas class="aspect-ratio-box-content" />
</div>

</div>

[This post]: https://ivan.sanchezortega.es/devel/2019/02/14/a-rant-about-webgl-frameworks.html#a-rant-about-the-webgl-api
[npm packages tagged with "WebGL"]: https://www.npmjs.com/search?q=keywords:webgl
[regl]: https://regl.party/
[inspired by React]: http://regl.party/api#inputs
[far]: https://thebookofshaders.com/
[better]: https://webglfundamentals.org/
[options]: https://www.html5rocks.com/en/tutorials/webgl/shaders/
[glitch art]: https://en.wikipedia.org/wiki/Glitch_art
