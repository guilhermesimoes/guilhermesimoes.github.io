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
  var shader = sceneEl.querySelector('code').textContent;
  var maxSliderValue = parseFloat(slider.max);
  var gl = canvas.getContext('webgl');
  var regl = createREGL({ gl });

  var image = await imagePromise;
  var texture = regl.texture(image);
  var drawScreen = createDrawCommand(regl, shader);

  regl.frame(() => {
    cutoff = slider.value;
    if (cutoff !== lastCutoff) {
      lastCutoff = cutoff;
      drawScreen({ texture, cutoff: cutoff / maxSliderValue });
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

function createDrawCommand(regl, shaderBody) {
  return regl({
    frag: createFragmentShader(shaderBody),
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;

    vec2 normalizeCoords(vec2 zeroToOne) {
      // Convert from 0->1 to 0->2
      vec2 zeroToTwo = zeroToOne * 2.0;

      // Convert from 0->2 to -1->+1 (clip space)
      vec2 clipSpace = zeroToTwo - 1.0;

      // Flip y
      return clipSpace * vec2(1, -1);
    }

    void main () {
      uv = position;
      gl_Position = vec4(normalizeCoords(position), 0, 1);
    }`,

    attributes: {
      position: [
        -2, 0,
        0, -2,
        2, 2
      ]
    },

    count: 3,

    uniforms: {
      texture: regl.prop('texture'),
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
