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
  var el, renderer, camera, scene, cube, spotLight, controls, ray;

  var mazeObject;

  var tileSize = 512;

  var selector = '#game';

  var velocity = 50;

  var time = Date.now();

  var objects = [];

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
    // spotLight.castShadow = true;
    // spotLight.shadowMapWidth = 1024;
    // spotLight.shadowMapHeight = 1024;
    // spotLight.shadowCameraNear = 500;
    // spotLight.shadowCameraFar = 4000;
    // spotLight.shadowCameraFov = 60;
    spotLight.target.position.set(0, 0, -1);
    controls.getObject().add(spotLight.target);
    spotLight.position = controls.getObject().position;
    scene.add(spotLight);

    // ray caster
    ray = new THREE.Raycaster();

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

    ray.ray.origin.copy(controls.getObject().position);
    var intersections = ray.intersectObjects(objects);
    if (intersections.length > 0) {
    }

    controls.update(Date.now() - time);

    time = Date.now();

    requestAnimationFrame(render);
  }

  // plane geo
  function getPlane() {
    var geometry = new THREE.PlaneGeometry(tileSize, tileSize, 100, 100);
    var material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });
    var result = new THREE.Mesh(geometry, material);
    result.overdraw = true;
    result.position.y = tileSize/2;
    return result;
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
    objects.push(floor);
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
    objects.push(ceiling);
    // add walls
    var maze = mazeObject.maze;
    for (var i = 0; i < mazeObject.cols; i++) {
      for (var j = 0; j < mazeObject.rows; j++) {
        var tile = maze[i][j];
        var x = j;
        var y = i;
        var plane;
        if (tile.up) {
          plane = getPlane();
          plane.position.x = x*tileSize+tileSize/2;
          plane.position.z = y*tileSize;
          scene.add(plane);
          objects.push(plane);
        }
        if (tile.down) {
          plane = getPlane();
          plane.position.x = x*tileSize+tileSize/2;
          plane.position.z = (y+1)*tileSize;
          plane.rotation.y = Math.PI;
          scene.add(plane);
          objects.push(plane);
        }
        if (tile.left) {
          plane = getPlane();
          plane.position.x = x*tileSize;
          plane.position.z = y*tileSize+tileSize/2;
          plane.rotation.y = Math.PI/2;
          scene.add(plane);
          objects.push(plane);
        }
        if (tile.right) {
          plane = getPlane();
          plane.position.x = (x+1)*tileSize;
          plane.position.z = y*tileSize+tileSize/2;
          plane.rotation.y = 3*Math.PI/2;
          scene.add(plane);
          objects.push(plane);
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
