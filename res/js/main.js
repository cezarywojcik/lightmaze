$(function($) {
  // vars
  var el, renderer, camera, scene, cube, spotLight, controls, ray, dirLight;

  var mazeObject;

  var tileSize = 512;

  var selector = '#game';

  var velocity = 50;

  var time = Date.now();

  var objects = [];

  var settings = {
    lightIntensity: 1
  };

  var havePointerLock = 'pointerLockElement' in document ||
  'mozPointerLockElement' in document ||
  'webkitPointerLockElement' in document;

  if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function ( event ) {
      if ( document.pointerLockElement === element ||
        document.mozPointerLockElement === element ||
        document.webkitPointerLockElement === element ) {
        controls.enabled = true;
        blocker.style.display = 'none';
      } else {
        controls.enabled = false;
        blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';
        instructions.style.display = '';
      }
    };

    var pointerlockerror = function ( event ) {
      instructions.style.display = '';
    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange',
      pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange',
      pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange',
      pointerlockchange, false );

    document.addEventListener('pointerlockerror',
      pointerlockerror, false);
    document.addEventListener('mozpointerlockerror',
      pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror',
      pointerlockerror, false );

    document.addEventListener('click', function ( event ) {
      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock ||
        element.mozRequestPointerLock || element.webkitRequestPointerLock;

      if (/Firefox/i.test( navigator.userAgent)) {
        var fullscreenchange = function (event) {
          if ( document.fullscreenElement === element ||
            document.mozFullscreenElement === element ||
            document.mozFullScreenElement === element ) {

            document.removeEventListener('fullscreenchange',
              fullscreenchange );
            document.removeEventListener('mozfullscreenchange',
              fullscreenchange );
            element.requestPointerLock();
          }
        };

        document.addEventListener( 'fullscreenchange',
          fullscreenchange, false );
        document.addEventListener( 'mozfullscreenchange',
          fullscreenchange, false );

        element.requestFullscreen = element.requestFullscreen ||
          element.mozRequestFullscreen || element.mozRequestFullScreen ||
          element.webkitRequestFullscreen;

        element.requestFullscreen();

      } else {
        element.requestPointerLock();
      }
    }, false );
  } else {
    // cant pointer lock
  }

  // textures
  var numTexturesLoaded = 0;
  var textures = {
    wallTexture: loadTexture('res/img/wall.png'),
    ceilingTexture: loadTexture('res/img/ceiling.png')
  };

  function loadTexture(image) {
    var texture = new THREE.ImageUtils.loadTexture(image,
      new THREE.UVMapping(), function() {
        textureLoaded();
    });
    texture.needsUpdate = true;
    return texture;
  }

  function textureLoaded() {
    numTexturesLoaded++;
    if (numTexturesLoaded === Object.keys(textures).length) {
      init();
    }
  }

  function init() {
    el = $(selector);

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.html(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // get maze object
    mazeObject = mazegen(5, 5);

    // camera
    camera = new THREE.PerspectiveCamera(60,
          window.innerWidth/(window.innerHeight), 0.1, 10000);
    camera.position.y = tileSize/2;

    // controls
    controls = new THREE.PointerLockControls(camera);
    controls.getObject().position.x = tileSize;
    controls.getObject().position.z = tileSize;
    controls.enabled = true;
    scene.add(controls.getObject());

    // start location
    controls.getObject().position.x = mazeObject.start.x*tileSize+tileSize/2;
    controls.getObject().position.z = mazeObject.start.y*tileSize+tileSize/2;

    // spot light
    spotLight = new THREE.SpotLight(0xffffff, settings.lightIntensity,
      tileSize*4);
    spotLight.angle = Math.PI/4;
    spotLight.exponent = 30;
    spotLight.target.position.set(0, controls.getPitchObject().rotation.x, -1);
    controls.getObject().add(spotLight.target);
    spotLight.position = controls.getObject().position;
    scene.add(spotLight);

    // directional light
    dirLight = new THREE.DirectionalLight(0x000000, 1);
    dirLight.target.position.set(0, 1, 0);
    dirLight.position = controls.getObject().position;
    scene.add(dirLight);

    // ray caster
    ray = new THREE.Raycaster();

    // add maze.
    addMaze();

    // render
    render();
  }

  // render
  function render() {
    renderer.render(scene, camera);

    spotLight.target.position.y = controls.getPitchObject().rotation.x+0.35;

    controls.update(Date.now() - time);

    time = Date.now();

    requestAnimationFrame(render);
  }

  // plane geo
  function getPlane() {
    var geometry = new THREE.PlaneGeometry(tileSize, tileSize, 10, 10);
    var material = new THREE.MeshPhongMaterial({
      map: textures.wallTexture
    });
    var result = new THREE.Mesh(geometry, material);
    result.overdraw = true;
    result.position.y = tileSize/2;
    return result;
  }

  // add maze meshes from mazeObject
  function addMaze() {
    var maze = mazeObject.maze;
    for (var i = 0; i < mazeObject.cols; i++) {
      for (var j = 0; j < mazeObject.rows; j++) {
        var tile = maze[i][j];
        var x = i;
        var y = j;
        // ceiling
        var ceilingGeo = new THREE.PlaneGeometry(tileSize, tileSize, 5, 5);
        var ceilingMat = new THREE.MeshPhongMaterial({
          map: textures.ceilingTexture
        });
        var ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
        ceiling.rotation.x = Math.PI/2;
        ceiling.position.y = tileSize;
        ceiling.position.x += x*tileSize+tileSize/2;
        ceiling.position.z += y*tileSize+tileSize/2;
        scene.add(ceiling);
        objects.push(ceiling);
        // ground
        var groundGeo = new THREE.PlaneGeometry(tileSize, tileSize, 5, 5);
        var groundMat = new THREE.MeshPhongMaterial({
          map: textures.ceilingTexture
        });
        var ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = 3*Math.PI/2;
        ground.position.y = 0;
        ground.position.x += x*tileSize+tileSize/2;
        ground.position.z += y*tileSize+tileSize/2;
        scene.add(ground);
        objects.push(ground);
        // walls
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
    camera.aspect = window.innerWidth/(window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
