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
    camera.position.y = tileSize/2;
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
        var geometry, material, plane;
        if (tile.up) {
          geometry = new THREE.PlaneGeometry(tileSize, tileSize, 1, 1);
          geometry.vertices[0].x = x*tileSize;
          geometry.vertices[0].y = 0;
          geometry.vertices[0].z = (y+1)*tileSize;
          geometry.vertices[1].x = (x+1)*tileSize;
          geometry.vertices[1].y = 0;
          geometry.vertices[1].z = (y+1)*tileSize;
          geometry.vertices[2].x = x*tileSize;
          geometry.vertices[2].y = tileSize;
          geometry.vertices[2].z = (y+1)*tileSize;
          geometry.vertices[3].x = (x+1)*tileSize;
          geometry.vertices[3].y = tileSize;
          geometry.vertices[3].z = (y+1)*tileSize;
          material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true
          });
          plane = new THREE.Mesh(geometry, material);
          plane.overdraw = true;
          scene.add(plane);
        }
        if (tile.down) {
          geometry = new THREE.PlaneGeometry(tileSize, tileSize, 1, 1);
          geometry.vertices[0].x = x*tileSize;
          geometry.vertices[0].y = 0;
          geometry.vertices[0].z = y*tileSize;
          geometry.vertices[1].x = (x+1)*tileSize;
          geometry.vertices[1].y = 0;
          geometry.vertices[1].z = y*tileSize;
          geometry.vertices[2].x = x*tileSize;
          geometry.vertices[2].y = tileSize;
          geometry.vertices[2].z = y*tileSize;
          geometry.vertices[3].x = (x+1)*tileSize;
          geometry.vertices[3].y = tileSize;
          geometry.vertices[3].z = y*tileSize;
          material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true
          });
          plane = new THREE.Mesh(geometry, material);
          plane.overdraw = true;
          scene.add(plane);
        }
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
