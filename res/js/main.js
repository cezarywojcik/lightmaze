var sample = {
  start: {x:0, y:0},
  end: {x:2, y:2},
  maze: [
    [
      {
        up: true,
        down: false,
        left: true,
        right: false
      },
      {
        up: true,
        down: false,
        left: false,
        right: true
      }
    ],
    [
      {
        up: false,
        down: true,
        left: true,
        right: false
      },
      {
        up: false,
        down: true,
        left: false,
        right: true
      }
    ]
  ]
};

jQuery(function($) {
  // vars
  var el, renderer, camera, scene, cube;

  function init(selector) {
    el = $(selector);

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight-4);
    el.html(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(60,
          window.innerWidth/(window.innerHeight-4), 0.1, 5000);
    camera.position.y = 150;
    camera.position.z = 350;

    // scene
    scene = new THREE.Scene();



    // render
    render();
  }

  function render() {
    renderer.render(scene, camera);

    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;

    requestAnimationFrame(render);
  }

  // resize handler
  $(window).resize(function() {
      camera.aspect = window.innerWidth/(window.innerHeight-4);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight-4);
    });

  init('#game');
});
