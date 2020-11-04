---
layout:   post
title:    <span class='nowrap'>Shaders Case Study:</span> <span class='nowrap'>Pokémon Battle Transitions</span> <span class='nowrap'>- Part II</span>
subtitle: "Gotta shade 'em all"
date:     2020-11-03 22:00:37 +1000
hero_image:
  path:   /assets/images/cute-pokemon.gif
  alt:    "Gif from Pokémon Red, where a trainer challenges the main player and says 'I like shorts'."
  ratio:  ratio-game-boy
meta_image:
  path:   /assets/images/pokemon-textures/gold-sudowoodo.png
---

In [part 1] of this shaders case study I explained how to achieve various transitions by applying different fragment shaders to a texture. These fragment shaders used _math_ to calculate

A value called `cutoff` determines how far along the animation is.
As the `cutoff` increases, so does the number of pixels that enter the first condition branch and so the more pixels are painted black.


This time though we'll do something different. Instead of writing shader code to calculate the `cutoff` for each individual pixel depending on its coordinates, I'll use the same shader for all transitions and change the gradient texture only.

I’ll use [the same vertex shader I used before] to render textures and then use different gradient textures to achieve these transitions:

{toc}

All of them follow this strategy:

```ruby
result = sampleFromGradient(pixelCoordinates)
if result < cutoff
  paintBlack
else
  paintColorFromTexture(pixelCoordinates)
```

More concretely, all of them use this exact code:

<div class="fragment" markdown="1">

```cpp
void main() {
  vec4 p = texture2D(gradient, uv);
  if (p.r < cutoff) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(texture, uv);
  }
}
```

</div>


Notice how the same [uv coordinates] are used to get both the gradient value and the texture color. This works even if the images have different dimensions because uv coordinates go from 0 to 1, independently of the image size.

Just like in [part 1], the UI sliders go from 0 to 100 but the `cutoff` value is scaled down so that inside each shader it goes from 0 to 1.

So without further ado, let's begin. The first two shaders are exactly the same as the first two shaders in [part 1], except this time they both use the same fragment shader. Their only difference is that they sample the cutoff from a different gradient texture.

<div class="scene" data-texture-src="/assets/images/pokemon-textures/red-cinnabar-mansion.png" markdown="1">

# Left To Right Wipe

<img class="gradient" src="/assets/images/gradients/wipe-left-to-right.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/yellow-surprise.png" markdown="1">

# Vertical Reflected Wipe

<img class="gradient" src="/assets/images/gradients/wipe-vertical-reflected.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/red-cinnabar.png" markdown="1">

# Diagonal Wipe

<img class="gradient" src="/assets/images/gradients/wipe-diagonal.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/yellow-misty.png" markdown="1">

# Crashing Wave

<img class="gradient" src="/assets/images/gradients/crashing-wave.png">

<div>{%- include canvas-playground.html -%}</div>

Here's where things start to get interesting.

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/red-blue.png" markdown="1">

# Chess, then Circles

<img class="gradient" src="/assets/images/gradients/chess-then-circles.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-rival-6.png" markdown="1">

# Circles, Chess then Circles again

<img class="gradient" src="/assets/images/gradients/circles-then-chess-then-circles.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/crystal-ho-oh.png" markdown="1">

# Enclosing Triangles

<img class="gradient" src="/assets/images/gradients/enclosing-triangles.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-1.png" markdown="1">

# Horizontal Stripes

<img class="gradient" src="/assets/images/gradients/horizontal-stripes.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-2.png" markdown="1">

# Spinning Spiral

<img class="gradient" src="/assets/images/gradients/spinning-spiral.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-3.png" markdown="1">

# Gooey

<img class="gradient" src="/assets/images/gradients/gooey.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-4.png" markdown="1">

# Trapped

<img class="gradient" src="/assets/images/gradients/trapped.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-5.png" markdown="1">

# Poké Arena

<img class="gradient" src="/assets/images/gradients/poke-arena.png">

<div>{%- include canvas-playground.html -%}</div>

</div>

<hr />

As you can see, it's much easier to create animations using textures than with code. We're moving the complexity from one place to another though. Creating these textures isn't easy. Changing the speed and timing function of the animation is also doable using just the texture, but that's just complicating things. For those types of adjustments it's better to use code.

<script type="text/javascript" src="/assets/js/vendor/regl-2.0.1.min.js"></script>
{%- include slider.html -%}

[part 1]: 2020-10-19-shaders-case-study-pokemon-battles.md
[the same vertex shader I used before]: 2020-10-05-regl-rendering-a-texture.md#vertex-shader
[uv coordinates]: https://www.creativebloq.com/features/uv-mapping-for-beginners

[how to use shaders to recreate the battle transitions seen in Pokémon]: https://www.youtube.com/watch?v=LnAoD7hgDxw
[regl]: https://regl.party/
[GLSL]: https://en.wikipedia.org/wiki/OpenGL_Shading_Language
[`mix`]: https://thebookofshaders.com/glossary/?search=mix
[swizzling]: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Swizzling
[`atan`]: https://en.wikipedia.org/wiki/Inverse_trigonometric_functions
[`atan2`]: https://en.wikipedia.org/wiki/Atan2
[shadertoy]: https://www.shadertoy.com/
