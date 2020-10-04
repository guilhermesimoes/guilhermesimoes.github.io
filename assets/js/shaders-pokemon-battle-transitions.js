window.addEventListener('load', async function onLoad() {
  var gl = document.getElementById('canvas').getContext('webgl');
  if (!gl) {
    // TODO
    console.log('No WebGL');
  }

  var imagePromises = loadImages();
  var lastCutoff;
  var lastTime;
  var cutoff;
  var timeoutId;
  var animationState;
  var missingCutoff;
  var animationDuration = 2; // seconds
  var maxSliderValue = 100;
  var slider = document.querySelector('.slider');
  var regl = createREGL({ gl: gl });
  var playPauseButton = new PlayPauseButton(document.querySelector('.js-play-pause-button'), state => {
    animationState = state;
    if (state === 'playing' && cutoff === 100) {
      slider.value = 0;
    }
  });

  slider.addEventListener('input', () => {
    if (animationState === 'playing') {
      animationState = playPauseButton.goToNextState();
    }
  })

  var screenWipe = `
    if (uv.x < cutoff) {
      gl_FragColor = vec4(0, 0, 0, 1);
    } else {
      gl_FragColor = texture2D(texture, uv);
    }
  `;

  var curtainsDown = `
    if (uv.y < cutoff) {
      gl_FragColor = vec4(0, 0, 0, 1);
    } else {
      gl_FragColor = texture2D(texture, uv);
    }
  `;

  var joinCenter = `
    if (0.5 - abs(uv.y - 0.5) < abs(cutoff) * 0.5) {
      gl_FragColor = vec4(0, 0, 0, 1);
    } else {
      gl_FragColor = texture2D(texture, uv);
    }
  `;

  var fadeToWhite =`
    vec4 white = vec4(1, 1, 1, 1);
    vec4 color = texture2D(texture, uv);
    gl_FragColor = mix(color, white, cutoff);
  `;

  var fadeToBlack =`
    vec4 color = texture2D(texture, uv);
    color.rgb = color.rgb * (cutoff * -1.0 + 1.0);
    gl_FragColor = color;
  `;

  var drawScreen = regl({
    frag: `
    precision mediump float;
    uniform sampler2D texture;
    uniform float cutoff;
    varying vec2 uv;
    void main () {
      ${fadeToBlack}
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;

    vec2 normalizeCoords(vec2 zeroToOne) {
      // Convert from 0->1 to 0->2
      vec2 zeroToTwo = zeroToOne * 2.0;

      // Convert from 0->2 to -1->+1 (clip space)
      vec2 clipSpace = zeroToTwo - 1.0;

      // invert y
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

  function render ({ time }) {
    cutoff = parseFloat(slider.value);

    if (animationState === 'playing') {
      if (cutoff < maxSliderValue) {
        timeInterval = time - lastTime;
        moreCutoff = timeInterval * maxSliderValue / animationDuration;

        console.log(time, moreCutoff, cutoff);
        slider.value = cutoff + moreCutoff;
      } else {
        animationState = playPauseButton.goToNextState();
      }
    }

    if (cutoff !== lastCutoff) {
      lastCutoff = cutoff;
      drawScreen({ texture: textures[0], cutoff: cutoff / maxSliderValue });
    }
    lastTime = time;
  }

  var images = await imagePromises;
  var textures = images.map(regl.texture);
  regl.frame(render);
});

async function loadImages() {
  var imageUrls = ['/assets/images/shaders-case-study/bugcatch1.png'];
  return await Promise.all(imageUrls
    .map(imageUrl => {
      var image = new Image();
      var imgLoadPromise = onload2promise(image);
      image.src = imageUrl;
      return imgLoadPromise;
    }));
}

function onload2promise(obj){
  return new Promise((resolve, reject) => {
    obj.onload = () => resolve(obj);
    obj.onerror = reject;
  });
}

class PlayPauseButton {
    constructor(el, onAction) {
      this.el = el;
      this.onAction = onAction;
      this.animationDuration = 350;
      this.el.addEventListener('click', this.onClick.bind(this));
    }

    onClick() {
      var state = this.goToNextState();
      if (this.onAction) { return this.onAction(state) };
    }

    goToNextState() {
      var useEl = this.el.querySelector('use');
      var iconId = useEl.getAttribute('xlink:href');
      var currentIcon = document.querySelector(iconId);
      var nextIcon = currentIcon.getAttribute('data-next-icon');

      useEl.setAttribute('xlink:href', '#' + nextIcon);

      if (nextIcon === 'play-icon') {
        return 'paused';
      } else {
        return 'playing';
      }
    }
};
