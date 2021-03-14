---
layout:   post
title:    <span class='nowrap'>Shaders Case Study:</span> <span class='nowrap'>Pokémon Battle Transitions</span> <span class='nowrap'>- Part III</span>
subtitle: TODO
date:     2020-11-15 12:39:42 +1000
hero_image:
  path:   TODO
  alt:    "TODO"
  ratio:  ratio-game-boy
image:
  path:   TODO
scripts:
  - vendor/regl-2.0.1.min.js
  - vendor/d3-color+ease+timer+interpolate+dispatch+selection+transition.min.js
  - slider.js
  - shaders-case-study-pokemon-battles-part-2.js
---

In [part 2] I created various transitions using different gradient textures, which I mostly found on the web ([1], [2]). For this post I decided to make my own textures, based on the [transitions of the original Pokémon Red and Blue games]:

{toc}

Let's go then.


<div class="scene" data-texture-src="/assets/images/pokemon-textures/red-barrel.png" markdown="1">

# Horizontal Stripes
<img class="gradient" src="/assets/images/gradients/stripes-horizontal.png" alt="">
{% include canvas-playground.html -%}

</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/red-cinnabar.png" markdown="1">

# Vertical Stripes
<img class="gradient" src="/assets/images/gradients/stripes-vertical.png" alt="">
{% include canvas-playground.html -%}
</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/red-gym-4-celadon.png" markdown="1">

# Pixelated Radial Wipe
<img class="gradient" src="/assets/images/gradients/wipe-radial-pixelated.png" alt="">
{% include canvas-playground.html -%}
</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/yellow-misty.png" markdown="1">

# Pixelated Double Radial Wipe
<img class="gradient" src="/assets/images/gradients/wipe-radial-double-pixelated.png" alt="">
{% include canvas-playground.html -%}
</div>


<div class="scene" data-texture-src="/assets/images/pokemon-textures/yellow-viridian-forest.png" markdown="1">

# Outward Spiral
<img class="gradient" src="/assets/images/gradients/wipe-radial-double-pixelated.png" alt="">
{% include canvas-playground.html -%}
</div>

<div class="fragment hidden" markdown="1">

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


<hr />

Pretty cool, huh? If you check [the last two transitions of this video], you can see that there are some other amazing effects

{% include slider.html %}

[part 2]: 2020-11-15-shaders-case-study-pokemon-battles-part-2.md
[1]: https://www.youtube.com/watch?v=WvvvzupH18s
[2]: https://www.youtube.com/watch?v=LnAoD7hgDxw
[transitions of the original Pokémon Red and Blue games]: https://www.youtube.com/watch?v=YbDCXJ0xH2g
[the last two transitions of this video]: https://www.youtube.com/watch?v=YbDCXJ0xH2g&t=119s
