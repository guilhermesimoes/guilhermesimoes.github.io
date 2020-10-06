window.addEventListener('load', function onLoad() {
  Array.from(document.querySelectorAll('.scene')).forEach(setupScene);
});

async function setupScene(sceneEl) {
  var canvas = sceneEl.querySelector('canvas');

  if (!window.WebGLRenderingContext) {
    var ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.font = '18px serif';
    ctx.fillText('Your browser does not support WebGL :(', canvas.width / 2, canvas.height / 2);
    return;
  }

  var cutoff;
  var lastCutoff;
  var animationDuration = 1500; // milliseconds
  var imagePromise = loadImage(sceneEl.getAttribute('data-texture-src'));
  var slider = new Slider(sceneEl.querySelector('.slider-container'), { animationDuration });
  var fragMain = sceneEl.querySelector('code').textContent;
  var frag = createFragmentShader(fragMain);
  var maxSliderValue = parseFloat(slider.max);
  var gl = canvas.getContext('webgl');
  var regl = createREGL({ gl });

  var image = await imagePromise;
  var texture = regl.texture(image);
  var drawScreen = createDrawCommand(regl, frag, texture);

  regl.frame(() => {
    cutoff = slider.value;
    if (cutoff !== lastCutoff) {
      lastCutoff = cutoff;
      drawScreen({ cutoff: cutoff / maxSliderValue });
    }
  });
}

function createFragmentShader(main) {
  return `
    precision mediump float;
    uniform sampler2D texture;
    uniform float cutoff;
    varying vec2 uv;
    ${main}
  `;
}

function createDrawCommand(regl, frag, texture) {
  return regl({
    frag,
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;

    vec2 normalizeCoords(vec2 position) {
      // Increase texture in size so it can cover the entire screen
      // Convert from 0->1 to 0->2
      vec2 full = position * 2.0;

      // Center in clip space
      // Convert from 0->2 to -1->+1 (clip space)
      vec2 centered = full - 1.0;

      // Flip y
      return centered * vec2(1, -1);
    }

    void main () {
      uv = position;
      gl_Position = vec4(normalizeCoords(position), 0, 1);
    }`,

    count: 3,
    attributes: {
      position: [
        -2, 0,
        0, -2,
        2, 2
      ]
    },

    uniforms: {
      texture,
      cutoff: regl.prop('cutoff')
    }
  });
}

async function loadImage(imageUrl) {
  var image = new Image();
  var imgLoadPromise = onload2promise(image);
  image.src = imageUrl;
  return imgLoadPromise;
}

function onload2promise(obj){
  return new Promise((resolve, reject) => {
    obj.onload = () => resolve(obj);
    obj.onerror = reject;
  });
}
