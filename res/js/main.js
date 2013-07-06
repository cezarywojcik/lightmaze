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

  var mazeObject;

  var tileSize = 512;

  function init(selector) {
    el = $(selector);

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight-4);
    el.html(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(60,
          window.innerWidth/(window.innerHeight-4), 0.1, 5000);
    camera.position.z = tileSize/2;

    // scene
    scene = new THREE.Scene();

    // object
    mazeObject = sample;

    // add maze
    addMaze();

    // render
    render();
  }

  // render
  function render() {
    renderer.render(scene, camera);

    camera.rotation.y += 0.02;

    requestAnimationFrame(render);
  }

  // add maze meshes from mazeObject
  function addMaze() {
    var maze = mazeObject.maze;
    for (var i = 0; i < maze.length; i++) {
      for (var j = 0; j < maze[i].length; j++) {
        var tile = maze[i][j];
        var x = j;
        var y = i;
        var geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        var material = new THREE.MeshNormalMaterial();
        var plane = new THREE.Mesh(geometry, material);
        plane.overdraw = true;
        plane.position.x = x*tileSize;
        plane.position.y = y*tileSize;
        scene.add(plane);
      }
    }
  }

  // resize handler
  $(window).resize(function() {
      camera.aspect = window.innerWidth/(window.innerHeight-4);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight-4);
    });

  init('#game');
});
