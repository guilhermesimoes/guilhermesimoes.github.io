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

  var images = await imagePromises;
  textures = images.map(regl.texture);

  var cutoff;
  regl.frame(function () {
    if (slider.value !== cutoff) {
      cutoff = slider.value;
      drawScreen({ texture: textures[0], cutoff: parseFloat(cutoff) / 100 });
    }
  });
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
