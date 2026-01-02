self.addEventListener('load', function onLoad() {
  Array.from(document.querySelectorAll('.scene')).forEach(setupScene);
});

async function setupScene(sceneEl) {
  var canvas = sceneEl.querySelector('canvas');

  if (!self.WebGLRenderingContext) {
    var ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.font = '18px serif';
    ctx.fillText('Your browser does not support WebGL :(', canvas.width / 2, canvas.height / 2);
    return;
  }

  var imagePromise = loadImage(sceneEl.getAttribute('data-texture-src'));
  var vert = sceneEl.querySelector('.vertex-shader').textContent;
  var frag = document.querySelector('.fragment-shader').textContent;
  var gl = canvas.getContext('webgl');
  var regl = createREGL({ gl });

  var image = await imagePromise;
  var texture = regl.texture(image);
  var drawScreen = createDrawCommand(regl, vert, frag, texture);
  drawScreen();
}

function createDrawCommand(regl, vert, frag, texture) {
  return regl({
    frag,
    vert,
    count: 3,
    attributes: {
      position: [
        -2, 0,
        0, -2,
        2, 2
      ]
    },
    uniforms: {
      texture
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
