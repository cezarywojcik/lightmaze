var sample = {
  start: {x:0, y:0},
  end: {x:2, y:2},
  cols: 2,
  rows: 2,
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
  var el, renderer, camera, scene, cube, pointLight;

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
    camera.position.x = tileSize;
    camera.position.z = tileSize;

    // scene
    scene = new THREE.Scene();

    // point light
    pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position = camera.position;
    pointLight.rotation = camera.rotation;
    scene.add(pointLight);

    // object
    mazeObject = sample;

    // add maze.
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

  // plane geo
  function getPlaneGeometry() {
    var geometry = new THREE.PlaneGeometry(tileSize, tileSize, 1, 1);
    geometry.vertices[0].y = 0;
    geometry.vertices[1].y = 0;
    geometry.vertices[2].y = tileSize;
    geometry.vertices[3].y = tileSize;
    return geometry;
  }

  // add maze meshes from mazeObject
  function addMaze() {
    // floor
    var width = mazeObject.cols*tileSize;
    var height = mazeObject.rows*tileSize;
    var floorGeo = new THREE.PlaneGeometry(width, height,
      mazeObject.cols, mazeObject.rows);
    var floorMat = new THREE.MeshLambertMaterial({
      color: 0x00ff00,
      side: THREE.BackSide
    });
    var floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = Math.PI/2;
    floor.position.x = tileSize;
    floor.position.z = tileSize;
    scene.add(floor);
    // ceiling
    var ceilingMat = new THREE.MeshLambertMaterial({
      color: 0x0000ff
    });
    var ceiling = new THREE.Mesh(floorGeo, ceilingMat);
    ceiling.position.y = tileSize;
    ceiling.rotation.x = Math.PI/2;
    ceiling.position.x = tileSize;
    ceiling.position.z = tileSize;
    scene.add(ceiling);
    // add walls
    var maze = mazeObject.maze;
    for (var i = 0; i < mazeObject.cols; i++) {
      for (var j = 0; j < mazeObject.rows; j++) {
        var tile = maze[i][j];
        var x = j;
        var y = i;
        var geometry, plane;
        var material = new THREE.MeshLambertMaterial({
            color: 0xff0000
        });
        if (tile.up) {
          geometry = getPlaneGeometry();
          geometry.vertices[3].x = x*tileSize;
          geometry.vertices[3].z = y*tileSize;
          geometry.vertices[2].x = (x+1)*tileSize;
          geometry.vertices[2].z = y*tileSize;
          geometry.vertices[1].x = x*tileSize;
          geometry.vertices[1].z = y*tileSize;
          geometry.vertices[0].x = (x+1)*tileSize;
          geometry.vertices[0].z = y*tileSize;
          plane = new THREE.Mesh(geometry, material);
          plane.overdraw = true;
          scene.add(plane);
        }
        if (tile.down) {
          geometry = getPlaneGeometry();
          geometry.vertices[0].x = x*tileSize;
          geometry.vertices[0].z = (y+1)*tileSize;
          geometry.vertices[1].x = (x+1)*tileSize;
          geometry.vertices[1].z = (y+1)*tileSize;
          geometry.vertices[2].x = x*tileSize;
          geometry.vertices[2].z = (y+1)*tileSize;
          geometry.vertices[3].x = (x+1)*tileSize;
          geometry.vertices[3].z = (y+1)*tileSize;
          plane = new THREE.Mesh(geometry, material);
          plane.overdraw = true;
          scene.add(plane);
        }
        if (tile.left) {
          geometry = getPlaneGeometry();
          geometry.vertices[0].x = x*tileSize;
          geometry.vertices[0].z = y*tileSize;
          geometry.vertices[1].x = x*tileSize;
          geometry.vertices[1].z = (y+1)*tileSize;
          geometry.vertices[2].x = x*tileSize;
          geometry.vertices[2].z = y*tileSize;
          geometry.vertices[3].x = x*tileSize;
          geometry.vertices[3].z = (y+1)*tileSize;
          plane = new THREE.Mesh(geometry, material);
          plane.overdraw = true;
          scene.add(plane);
        }
        if (tile.right) {
          geometry = getPlaneGeometry();
          geometry.vertices[3].x = (x+1)*tileSize;
          geometry.vertices[3].z = y*tileSize;
          geometry.vertices[2].x = (x+1)*tileSize;
          geometry.vertices[2].z = (y+1)*tileSize;
          geometry.vertices[1].x = (x+1)*tileSize;
          geometry.vertices[1].z = y*tileSize;
          geometry.vertices[0].x = (x+1)*tileSize;
          geometry.vertices[0].z = (y+1)*tileSize;
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
