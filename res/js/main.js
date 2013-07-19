/* globals mazegen */

var settings = {
  lightIntensity: 10,
  spike: false,
  spikeValue: 0,
  endGame: false,
  lightOn: true,
  started: false
};

var controls;

$(function($) {

  // get maze object
  var mazeObject = mazegen(20,20);

  // vars
  var el, renderer, camera, scene, spotLight;

  var tileSize = 512;

  var selector = '#game';

  var time = Date.now();

  var objects = [];

  var getTile = function(camera) {
    var x = camera.position.x;
    var y = camera.position.z;
    var newx = Math.floor(x/tileSize);
    var newy = Math.floor(y/tileSize);
    return {x: newx, y: newy};
  };

  var back = new Audio('res/aud/back.ogg');
  back.preload = 'auto';
  back.loop = true;
  back.volume = 0.3;
  back.play();

  var horror1 = new Audio('res/aud/horror1.ogg');
  horror1.preload = 'auto';
  back.volume = 0.5;
  var horror2 = new Audio('res/aud/horror2.ogg');
  horror2.preload = 'auto';
  back.volume = 0.5;
  var horror3 = new Audio('res/aud/horror3.ogg');
  horror3.preload = 'auto';
  back.volume = 0.5;


  // var prevcam
  var prevCam = new THREE.Vector3();

  // textures
  var numTexturesLoaded = 0;
  var textures = {
    wallTexture: loadTexture('res/img/wall.png'),
    ceilingTexture: loadTexture('res/img/ceiling.png'),
    endTexture: loadTexture('res/img/end.png')
  };

  document.addEventListener("click", function() {
    if(!settings.started) {
      playGame();
    }
  });

  $(window).keypress(function(e) {
      var key = e.keyCode;
      if(key === 13 && settings.started) {
        pauseGame();
      }
      if (key === 69 && settings.started) {
        settings.lightOn = !settings.lightOn;
        if (settings.lightOn) {
          spotLight.intensity = settings.spikeValue;
        } else {
          settings.spikeValue = spotLight.intensity;
          spotLight.intensity = 0;
        }
      }
    });

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
    el.attr('tabindex', '0');

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.html(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(60,
          window.innerWidth/(window.innerHeight), 0.1, 10000);

    // controls
    controls = new THREE.PointerLockControls(camera, mazeObject);
    controls.getObject().position.x = tileSize;
    controls.getObject().position.z = tileSize;
    scene.add(controls.getObject());

    // start location
    controls.getObject().position.x = mazeObject.start.x*tileSize+tileSize/2;
    controls.getObject().position.z = mazeObject.start.y*tileSize+tileSize/2;
    controls.getObject().position.y = tileSize/2;

    // spot light
    spotLight = new THREE.SpotLight(0xffffff, settings.lightIntensity,
      tileSize*4);
    spotLight.angle = Math.PI/4;
    spotLight.exponent = 30;
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    spotLight.shadowCameraNear = 500;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 30;
    spotLight.target.position.set(0, controls.getPitchObject().rotation.x, -1);
    controls.getObject().add(spotLight.target);
    spotLight.position = controls.getObject().position;
    scene.add(spotLight);

    // prevcam
    prevCam.copy(controls.getObject().position);

    // add maze
    addMaze();

    // render
    render();
  }

  // render
  function render() {
    renderer.render(scene, camera);
    prevCam.copy(controls.getObject().position);

    //noises
    if (settings.started) {
      if (Math.random() > 0.999) {
        horror1.play();
      }
      if (Math.random() > 0.9996) {
        horror2.play();
      }
      if (Math.random() > 0.999) {
        horror3.play();
      }
    }

    if (settings.spike && Math.random() > 0.42) {
      spotLight.intensity += settings.spikeValue;
      settings.spike = false;
    }

    var tilePoint = getTile(controls.getObject());

    if (spotLight.intensity < 0) {
      document.getElementById("endGame").style.zIndex = 2;
      document.location.reload();
      return;
    } else if (spotLight.intensity < 1 && back.volume > 0.006) {
      back.volume -= 0.004;
    }

    if (tilePoint.x === mazeObject.end.x && tilePoint.y === mazeObject.end.y) {
      settings.endGame = true;
      spotLight.angle = Math.PI/2;
    }

    if (settings.endGame) {
      spotLight.intensity += Math.random();
      spotLight.exponent -= Math.random();
      spotLight.distance = 20000;
      if (spotLight.exponent < 1) {
        document.location.reload();
        return;
      }
    } else if (settings.lightOn) {
      if (!settings.spike && Math.random() >
        (spotLight.intensity/settings.lightIntensity)*0.8+0.2) {
        settings.spikeValue = Math.random()*spotLight.intensity*0.9;
        spotLight.intensity -= settings.spikeValue;
        settings.spike = true;
      }
      if(settings.started && settings.lightOn) {
        spotLight.intensity -= Math.random()/100;
      }
    }

    spotLight.target.position.y = controls.getPitchObject().rotation.x;

    controls.update(Date.now() - time);

    time = Date.now();

    requestAnimationFrame(render);
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
        if (x === mazeObject.end.x && y === mazeObject.end.y) {
          groundMat = new THREE.MeshPhongMaterial({
            map: textures.endTexture
          });
        }
        var ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = 3*Math.PI/2;
        ground.position.y = 0;
        ground.position.x += x*tileSize+tileSize/2;
        ground.position.z += y*tileSize+tileSize/2;
        scene.add(ground);
        objects.push(ground);
        // wall
        if (tile.wall) {
          var wallGeo = new THREE.CubeGeometry(tileSize, tileSize, tileSize,
            5, 5);
          var wallMat = new THREE.MeshPhongMaterial({
            map: textures.wallTexture,
            reflectivity: 0.9,
            shininess: 50
          });
          var wall = new THREE.Mesh(wallGeo, wallMat);
          scene.add(wall);
          objects.push(wall);
          wall.overdraw = true;
          wall.position.x = x*tileSize+tileSize/2;
          wall.position.z = y*tileSize+tileSize/2;
          wall.position.y = tileSize/2;
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

function playGame() {
  giveGameFocus(true);
  $("#menu").fadeOut();
  settings.started = true;
}

function pauseGame() {
  giveGameFocus(false);
  $("#menu").fadeIn();
  settings.started = false;
}

function giveGameFocus(giveFocus) {
  if (giveFocus) {
    var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

    var element, pointerlockchange;
    if (havePointerLock) {
      element = document.body;
      pointerlockchange = function () {
        if ( document.pointerLockElement === element ||
          document.mozPointerLockElement === element ||
          document.webkitPointerLockElement === element ) {
          controls.enabled = true;
        } else {
          controls.enabled = false;
        }
      };
    }

    var pointerlockerror = function () {
      console.log("Error locking pointer.");
    };

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange',
      pointerlockchange, false);
    document.addEventListener( 'mozpointerlockchange',
      pointerlockchange, false);
    document.addEventListener( 'webkitpointerlockchange',
      pointerlockchange, false);

    document.addEventListener('pointerlockerror',
      pointerlockerror, false);
    document.addEventListener('mozpointerlockerror',
      pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror',
      pointerlockerror, false);
    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock ||
      element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if (/Firefox/i.test(navigator.userAgent)) {
      var fullscreenchange = function () {
        if ( document.fullscreenElement === element ||
          document.mozFullscreenElement === element ||
          document.mozFullScreenElement === element ) {
          element.requestPointerLock();

        }

        else if(document.cancelFullScreen ||
          document.mozCancelFullScreen ||
          document.webkitCancelFullScreen) {
          pauseGame();
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
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
