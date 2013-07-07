var maze = [];
var deadends = [];
var deadthresh = 6;
var totalpathed = 0;

//rows and cols must be positive integers 3 or greater
function mazegen(rows, cols) {

  var maxheight = rows - 1; //counting 0
  var maxwidth = cols - 1;

  deadthresh = Math.ceil((rows + cols) * 0.5);

  for (var i = 0; i <= maxheight; i++) { //rows

    maze[i] = [];

    for (var j = 0; j <= maxwidth; j++) { //columns (cells)
      {
        maze[i][j] = {};
        maze[i][j].pathed = false;
        if (i === 0 || j === 0 || i === maxheight || j === maxwidth) {
          maze[i][j].wall = true;
        } else {
          maze[i][j].wall = false;
        }
      }
    }

  }

  start = {
    x: Math.floor(maxwidth / 2),
    y: Math.floor(maxheight / 2)
  };

  //force the start point to open upward
  maze[start.x][start.y] = {
    pathed: true,
    wall: false,
    isInSolution: true
  };
  totalpathed = totalpathed + 1;
  //put walls around the start
  maze[start.x + 1][start.y].wall = true;
  maze[start.x - 1][start.y].wall = true;
  maze[start.x][start.y + 1].wall = true;

  //begin generation from the tile above the start
  while (totalpathed < maxheight * maxwidth / 3) {
    pathing(start.x, start.y - 1, "up", 0);
  }

  //clear out paths just in case we've blocked off something accidentally
  for (var k = 0; k <= maxheight; k++) { //rows

    for (var l = 0; l <= maxwidth; l++) { //columns (cells)
      {
        if (maze[k][l].pathed === true) {
          maze[k][l].wall = false;
        }
      }
    }

  }

  //determine end point
  var greatest_dist = 0;
  var end = {};
  for (var v = 0; v<deadends.length; v++) {
    if (deadends[v][2] > greatest_dist) {
      greatest_dist = deadends[v][2];
      end.x = deadends[v][0];
      end.y = deadends[v][1];
    }
  }

  return {
    start: start,
    end: end,
    rows: rows,
    cols: cols,
    maze: maze
  };
}

function pathing(x, y, enterdir, pathcount) {

  maze[x][y].pathed = true;
  totalpathed = totalpathed + 1;

  var upblocked = maze[x][y - 1].wall;
  var downblocked = maze[x][y + 1].wall;
  var leftblocked = maze[x - 1][y].wall;
  var rightblocked = maze[x + 1][y].wall;
  var uppathed = maze[x][y - 1].pathed;
  var downpathed = maze[x][y + 1].pathed;
  var leftpathed = maze[x - 1][y].pathed;
  var rightpathed = maze[x + 1][y].pathed;

  //dead-end check
  if (((upblocked || uppathed) && (downblocked || downpathed) && (leftblocked || leftpathed) && (rightblocked || rightpathed)) || (pathcount > deadthresh && Math.random() < 0.20)) {
    deadends.push([x, y, pathcount]);
  } else {

    do {

      var exitdir = Math.random() * 4;

      for (h = 0; h < 5; h++) {
        if (exitdir < 1 && !upblocked && !uppathed) {
          uppathed = true;
          pathing(x, y - 1, "up", pathcount + 1);
          break;
        } else if (exitdir < 2 && !downblocked && !downpathed) {
          downpathed = true;
          pathing(x, y + 1, "down", pathcount + 1);
          break;
        } else if (exitdir < 3 && !leftblocked && !leftpathed) {
          leftpathed = true;
          pathing(x - 1, y, "left", pathcount + 1);
          break;
        } else if (!rightblocked && !rightpathed) {
          rightpathed = true;
          pathing(x + 1, y, "right", pathcount + 1);
          break;
        } else {
          exitdir += 1;
          if (exitdir > 4) {
            exitdir -= 4;
          }
        }
      }
    }
    while (Math.random() < 0.3 && !((upblocked || uppathed) && (downblocked ||
      downpathed) && (leftblocked || leftpathed) && (rightblocked ||
      rightpathed)));
  }

  if (!uppathed) {
    maze[x][y - 1].wall = true;
  }
  if (!downpathed) {
    maze[x][y + 1].wall = true;
  }
  if (!leftpathed) {
    maze[x - 1][y].wall = true;
  }
  if (!rightpathed) {
    maze[x + 1][y].wall = true;
  }
}
