---
layout:   post
title:    <span class='nowrap'>Shaders Case Study:</span> <span class='nowrap'>Pokémon Battle Transitions</span> <span class='nowrap'>- Part II</span>
subtitle: "Create animations using gradient textures instead of code."
date:     2020-11-15 12:39:42 +1000
hero_image:
  path:   /assets/images/cute-pokemon.gif
  alt:    "Gif from Pokémon Red, where a trainer challenges the main player and says 'My friend has a cute Pokémon. I'm so jealous!'."
  ratio:  ratio-game-boy
image:
  path:   /assets/images/pokemon-textures/gold-bug-catching-grass.png
scripts:
  - vendor/regl-2.0.1.min.js
  - vendor/d3-color+ease+timer+interpolate+dispatch+selection+transition.min.js
  - slider.js
---

In [part 1] I created various transitions using different fragment shaders. These shaders used geometry formulas to calculate when each pixel should be hidden. While this made it possible to create some very cool animations, the math got complicated quickly.

A better strategy is to encode _in a texture_ when each pixel should be cutoff. That way it's no longer necessary to make any calculations. Basically instead of doing this:

```ruby
result = doMathWith(pixelCoordinates)
if result < cutoff
  paintBlack
else
  paintColorFromTexture(pixelCoordinates)
```

Do this:

```ruby
value = sampleFromGradient(pixelCoordinates)
if value < cutoff
  paintBlack
else
  paintColorFromTexture(pixelCoordinates)
```

This means that all these transitions use the same shader; their only difference is the gradient texture from which they sample:

{toc}

So without further ado, let's begin.


<div class="scene" data-texture-src="/assets/images/pokemon-textures/red-cinnabar-mansion.png" markdown="1">

# Left To Right Wipe
<img class="gradient" src="/assets/images/gradients/wipe-left-to-right.png" alt="">
{% include canvas-playground.html %}

This transition looks the same as the [Left To Right transition in part 1], but now it's using the gradient above.

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/yellow-surprise.png" markdown="1">

# Vertical Reflected Wipe
<img class="gradient" src="/assets/images/gradients/wipe-vertical-reflected.png" alt="">
{% include canvas-playground.html %}

Likewise, this transition looks the same as the [Vertical Reflected transition in part 1]. This time though, the only difference between this transition and the previous one is the gradient! The fragment shader remains the same.

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/red-cinnabar.png" markdown="1">

# Diagonal Wipe
<img class="gradient" src="/assets/images/gradients/wipe-diagonal.png" alt="">
{% include canvas-playground.html %}

Once again the shader is the same; only the gradient changes. Look how easy it is to create another transition. Just create another gradient!

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/yellow-misty.png" markdown="1">

# Crashing Wave
<img class="gradient" src="/assets/images/gradients/crashing-wave.png" alt="">
{% include canvas-playground.html %}

Here's where things get interesting. Creating this type of transition using only math would be pretty unwieldly. I won't comment on the next transitions as I think the results speak for themselves.

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/crystal-pokemon-sudowoodo.png" markdown="1">

# Chess, then Circles
<img class="gradient" src="/assets/images/gradients/chess-then-circles.png" alt="">
{% include canvas-playground.html %}

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-pokemon-sudowoodo.png" markdown="1">

# Circles, Chess and more Circles
<img class="gradient" src="/assets/images/gradients/circles-then-chess-then-circles.png" alt="">
{% include canvas-playground.html %}

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-1.png" markdown="1">

# Enclosing Triangles
<img class="gradient" src="/assets/images/gradients/enclosing-triangles.png" alt="">
{% include canvas-playground.html %}

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-2.png" markdown="1">

# Spinning Spiral
<img class="gradient" src="/assets/images/gradients/spinning-spiral.png" alt="">
{% include canvas-playground.html %}

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-3.png" markdown="1">

# Gooey
<img class="gradient" src="/assets/images/gradients/gooey.png" alt="">
{% include canvas-playground.html %}

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-4.png" markdown="1">

# Trapped
<img class="gradient" src="/assets/images/gradients/trapped.png" alt="">
{% include canvas-playground.html %}

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/gold-elite-four-5.png" markdown="1">

# Poké Arena
<img class="gradient" src="/assets/images/gradients/poke-arena.png" alt="">
{% include canvas-playground.html %}

</div>


<hr />

All of these transitions use [the same vertex shader I used before] and this exact fragment shader:

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

The shader only uses the red component of the gradient. The shader could use instead the green or blue components since all three components have the same value. Furthermore, while these [RGB values usually go from 0 to 255], in [GLSL] they go from 0 to 1. This makes it really easy to compare a color to the cutoff, since it also goes from 0 to 1.

The shader uses the same [uv coordinates] to get both the gradient value and the texture color. This works even if the images have different dimensions because uv coordinates go from 0 to 1, independently of the image size. Ideally the aspect ratio of the gradient should match the aspect ratio of the image / game, otherwise the animation can look stretched.

The bottom line is: it's much easier to create animations using textures than with code. Creating some of these textures isn't easy though. We're kind of moving the complexity around. But once you get the hang of it, the advantages are plenty.

{% include slider.html %}

[part 1]: 2020-10-19-shaders-case-study-pokemon-battles.md
[Left To Right transition in part 1]: 2020-10-19-shaders-case-study-pokemon-battles.md#left-to-right-wipe
[Vertical Reflected transition in part 1]: 2020-10-19-shaders-case-study-pokemon-battles.md#vertical-reflected-wipe
[the same vertex shader I used before]: 2020-10-05-regl-rendering-a-texture.md#vertex-shader
[RGB values usually go from 0 to 255]: https://en.wikipedia.org/wiki/RGB_color_model
[GLSL]: https://en.wikipedia.org/wiki/OpenGL_Shading_Language
[uv coordinates]: https://www.creativebloq.com/features/uv-mapping-for-beginners
