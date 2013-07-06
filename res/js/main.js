jQuery(function($) {
  // vars
  var el, renderer, camera, scene, cube;

  function init(selector) {
    el = $(selector);

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.html(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(60,
          window.innerWidth/(window.innerHeight), 0.1, 5000);
    camera.position.y = 150;
    camera.position.z = 350;

    // scene
    scene = new THREE.Scene();

    // cube
    cube = new THREE.Mesh(new THREE.CubeGeometry(200,200,200),
      new THREE.MeshNormalMaterial({
        color: 0x00ff00
      }));
    cube.position.y = 150;
    cube.overdraw = true;
    scene.add(cube);

    render();
  }

  function render() {
    renderer.render(scene, camera);

    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;

    requestAnimationFrame(render);
  }

  init('#game');
});
