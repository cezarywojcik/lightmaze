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

$(function($) {
  // vars
  var el, renderer, camera, scene, cube, spotLight, controls;

  var mazeObject;

  var tileSize = 512;

  var selector = '#game';

  var velocity = 50;

  var time = Date.now();

  // texture
  // var wallTexture = new THREE.ImageUtils.loadTexture('res/img/wall.png',
  //   new THREE.UVMapping(), function() {
  //     init();
  //   });
  // wallTexture.needsUpdate = true;

  function init() {
    el = $(selector);

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight-4);
    el.html(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(60,
          window.innerWidth/(window.innerHeight-4), 0.1, 5000);
    camera.position.y = tileSize/2;

    // controls
    controls = new THREE.PointerLockControls(camera);
    controls.getObject().position.x = tileSize;
    controls.getObject().position.z = tileSize;
    controls.enabled = true;
    scene.add(controls.getObject());

    // spot light
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.copy(camera.position);
    spotLight.position = controls.getObject().position;
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    spotLight.shadowCameraNear = 500;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 60;
    spotLight.target.position.y = tileSize/2;
    scene.add(spotLight);

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

    controls.update(Date.now() - time);

    time = Date.now();

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
      color: 0x00ff00
    });
    var floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = 3*Math.PI/2;
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

  init();
});
