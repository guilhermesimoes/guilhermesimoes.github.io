---
layout:   post
title:    "Shaders"
---
<div class="shaders">
  <div class="aspect-ratio-box ratio-game-boy">
    <canvas id="canvas" class="aspect-ratio-box-content" />
  </div>
  <div class="slider-container">
    <button class="play-pause-button">
      <svg viewBox="0 0 36 36">
        <use xlink:href="#play-icon" />
      </svg>
    </button>
    <input type="range" min="0" max="100" value="0" class="slider">
    <span class="display">0</span>
  </div>
</div>

<script type="text/javascript" src="/assets/js/regl-2.0.1.min.js"></script>
{%- include slider.html -%}

Inspired by https://www.youtube.com/watch?v=LnAoD7hgDxw

https://www.shadertoy.com/view/MdySWD

https://stackoverflow.com/questions/34443968/how-can-i-apply-a-pixel-shader-to-a-canvas-element

https://barcinolechiguino.github.io/Camera-Transitions-Research/
