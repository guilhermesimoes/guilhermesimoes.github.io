window.addEventListener('load', async function onLoad() {
  var gl = document.getElementById('canvas').getContext('webgl');
  if (!gl) {
    // TODO
    console.log('No WebGL');
  }

  var imagePromises = loadImages(regl);
  var playPauseButton = new PlayPauseButton(document.querySelector(".js-play-pause-button"));
  var slider = document.querySelector('.slider');
  var regl = createREGL({ gl: gl });

  var numPoints = 160 * 144;
  var points = [];
  for (var i=0; i<160; i++) {
    for (var j=0; j<144; j++) {
      points.push([i / 160, j / 144]);
    }
  }

  var drawScreen = regl({
    frag: `
    precision mediump float;
    uniform sampler2D texture;
    uniform float cutoff;
    varying vec2 uv;
    void main () {
      if (uv.x < cutoff) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
      gl_FragColor = texture2D(texture, uv);
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    void main () {
      uv = position;
      gl_Position = vec4(position * 2.0 - 1.0, 0, 1);
    }`,

    attributes: {
      position: points
    },

    primitive: 'points',

    count: numPoints,

    uniforms: {
      texture: regl.prop('texture'),
      cutoff: regl.prop('cutoff')
    },
  });

  var images = await imagePromises;
  textures = images.map(regl.texture);
  console.log(textures);

  var cutoff;
  regl.frame(function () {
    if (slider.value !== cutoff) {
      cutoff = slider.value;
      drawScreen({ texture: textures[0], cutoff: parseFloat(cutoff) });
    }
  });
});

function onload2promise(obj){
  return new Promise((resolve, reject) => {
    obj.onload = () => resolve(obj);
    obj.onerror = reject;
  });
}

async function loadImages() {
  var imageUrls = ['/assets/images/shaders-case-study/3.png'];
  return await Promise.all(imageUrls
    .map(imageUrl => {
      var image = new Image();
      var imgLoadPromise = onload2promise(image);
      image.src = imageUrl;
      return imgLoadPromise;
    }));
}

// function render(time) {
//   // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

//   gl.clearColor(1, 0, 0.5, 1);

//   requestAnimationFrame(render);
// }
// requestAnimationFrame(render);

class PlayPauseButton {
    constructor(el) {
      this.el = el;
      this.animationDuration = 350;
      this.el.addEventListener('click', this.goToNextState.bind(this));
    }

    goToNextState() {
      var useEl = this.el.querySelector('use');
      var iconId = useEl.getAttribute('xlink:href');
      var currentIcon = document.querySelector(iconId);
      var nextIconId = '#' + currentIcon.getAttribute('data-next-state');

      useEl.setAttribute('xlink:href', nextIconId);
    }
};
