/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function (camera, mazeObject) {

  var footsteps = new Audio('res/aud/footsteps.ogg');
  footsteps.preload = 'auto';
  footsteps.loop = true;
  footsteps.volume = 0.5;

  var footstepsPlaying = false;

  var tileSize = 512;

  var scope = this;

  var pitchObject = new THREE.Object3D();
  pitchObject.add(camera);

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add(pitchObject);

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;

  var isOnObject = false;
  var canJump = false;

  var velocity = new THREE.Vector3();

  var PI_2 = Math.PI / 2;

  var getTile = function(camera) {
    var x = camera.position.x;
    var y = camera.position.z;
    var newx = Math.floor(x/tileSize);
    var newy = Math.floor(y/tileSize);
    return mazeObject.maze[newx][newy];
  };

  var onMouseMove = function(event) {

    if (scope.enabled === false) return;

    var movementX = event.movementX || event.mozMovementX ||
      event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY ||
      event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2,
      pitchObject.rotation.x));

  };

  var onKeyDown = function(event) {

    switch (event.keyCode) {

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true; break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        if (canJump === true){
          velocity.y += 10;
        }
        canJump = false;
        break;

    }
    if (!footstepsPlaying && (moveForward || moveBackward ||
      moveLeft || moveRight)) {
      footsteps.play();
      footstepsPlaying = true;
    }

  };

  var onKeyUp = function(event) {

    switch(event.keyCode) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // a
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

    }
    if (footstepsPlaying && !moveForward  && !moveBackward  &&
      !moveLeft  && !moveRight) {
      footsteps.pause();
      footstepsPlaying = false;
    }

  };

  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);

  this.enabled = false;

  this.getObject = function () {
    return yawObject;

  };

  this.getPitchObject = function () {
    return pitchObject;
  };

  this.isOnObject = function(b) {

    isOnObject = b;
    canJump = b;

  };

  this.update = function (delta) {

    if (scope.enabled === false) return;

    delta *= 0.1;

    velocity.x += (- velocity.x) * 0.08 * delta;
    velocity.z += (- velocity.z) * 0.08 * delta;

    velocity.y -= 0.25 * delta;

    if (moveForward) velocity.z -= 0.72 * delta;
    if (moveBackward) velocity.z += 0.72 * delta;

    if (moveLeft) velocity.x -= 0.72 * delta;
    if (moveRight) velocity.x += 0.72 * delta;

    if (isOnObject === true) {
      velocity.y = Math.max(0, velocity.y);
    }

    yawObject.translateX(velocity.x);
    if (getTile(yawObject).wall) {
      yawObject.translateX(-1*velocity.x);
    }
    yawObject.translateY(velocity.y);
    if (getTile(yawObject).wall) {
      yawObject.translateY(-1*velocity.y);
    }
    yawObject.translateZ(velocity.z);
    if (getTile(yawObject).wall) {
      yawObject.translateZ(-1*velocity.z);
    }

    if (yawObject.position.y < tileSize/2) {
      if (!canJump) {
        if (!footstepsPlaying && (moveForward || moveBackward ||
          moveLeft || moveRight)) {
          footsteps.play();
          footstepsPlaying = true;
        }
      }

      velocity.y = 0;
      yawObject.position.y = tileSize/2;

      canJump = true;

    } else {
      footsteps.pause();
      footstepsPlaying = false;
    }

  };

};
