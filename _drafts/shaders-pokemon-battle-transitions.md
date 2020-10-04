---
layout:   post
title:    "Shaders"
---
<div class="shaders">
  <svg class="svg-symbol-defs">
    <defs>
      <path id="pause-icon" data-next-state="play-icon" d="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" />
      <path id="play-icon" data-next-state="pause-icon" d="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" />
    </defs>
  </svg>

  <div class="aspect-ratio-box ratio-game-boy">
    <canvas id="canvas" class="aspect-ratio-box-content" />
  </div>
  <div class="slider-container">
    <button class="play-pause-button js-play-pause-button">
      <svg viewBox="0 0 36 36">
        <use xlink:href="#play-icon" />
      </svg>
    </button>
    <input type="range" min="0" max="100" value="0" class="slider">
  </div>
</div>

<script type="text/javascript" src="/assets/js/regl-2.0.1.min.js" />

Inspired by https://www.youtube.com/watch?v=LnAoD7hgDxw

https://www.shadertoy.com/view/MdySWD

https://stackoverflow.com/questions/34443968/how-can-i-apply-a-pixel-shader-to-a-canvas-element

https://barcinolechiguino.github.io/Camera-Transitions-Research/
