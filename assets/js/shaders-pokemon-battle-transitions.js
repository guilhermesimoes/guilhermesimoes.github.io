window.addEventListener('load', async function onLoad() {
  var gl = document.getElementById('canvas').getContext('webgl');
  if (!gl) {
    // TODO
    console.log('No WebGL');
  }

  var imagePromises = loadImages(regl);

  var regl = createREGL({ gl: gl });

  var drawScreen = regl({
    frag: `
    precision mediump float;
    uniform sampler2D texture;
    varying vec2 uv;
    void main () {
      gl_FragColor = texture2D(texture, uv);
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    void main () {
      uv = position;
      gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
    }`,

    attributes: {
      position: [
        -2, 0,
        0, -2,
        2, 2]
    },

    uniforms: {
      texture: (context, props, batchId) => props.texture,
    },

    count: 3
  });

  var images = await imagePromises;
  textures = images.map(regl.texture);
  console.log(textures);

  // const drawTriangle = regl({
  //   frag: `
  //   void main() {
  //     gl_FragColor = vec4(1, 0, 0, 1);
  //   }`,

  //   vert: `
  //   attribute vec2 position;
  //   void main() {
  //     gl_Position = vec4(position, 0, 1);
  //   }`,

  //   attributes: {
  //     position: [[0, -1], [-1, 0], [1, 1]]
  //   },

  //   count: 3
  // });




  // regl.frame(function () {
  //   regl.clear({
  //     color: [0, 0, 0, 1]
  //   })
  // });

  drawScreen({ texture: textures[0] });


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