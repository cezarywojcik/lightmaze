var maze = [];
var deadends = [];
var deadthresh = 6;

//rows and cols must be positive integers 3 or greater
function mazegen(rows,cols) {

  var maxheight = rows - 1; //counting 0
  var maxwidth = cols - 1;

  deadthresh = Math.ceil((rows + cols)*0.7);

  for (var i = 0; i <= maxheight; i++) { //rows

    maze[i] = [];

    for (var j = 0; j <= maxwidth; j++) { //columns (cells)
      maze[i][j] = {
        pathed: false,

        up: true,
        down: true,
        left: true,
        right: true
      };
    }

  }

  start = {
    x: Math.floor(maxwidth/2),
    y: Math.floor(maxheight/2)
  };

  //force the start point to open upward
  maze[start.x][start.y] = {
  pathed: true,
  isInSolution: true,
  up: false,
  down: true,
  left: true,
  right: true
  };

  //begin generation from the tile above the start
  pathing(start.x, start.y-1, "up", 0, maxheight, maxwidth);

  //now clear all unused cells so they don't bog down the graphics
  for (k = 0; k <= maxheight; k++) { //rows
    for (l = 0; l <= maxwidth; l++) { //columns (cells)
      if (!maze[k][l].pathed) {
        maze[k][l].up = false;
        maze[k][l].down = false;
        maze[k][l].left = false;
        maze[k][l].right = false;
      }
    }
  }

  return {
    start: start,
    end: {x:0, y:0},
    rows: rows,
    cols: cols,
    maze: maze
  };
}

function pathing(x, y, enterdir, pathcount, maxheight, maxwidth) {

  maze[x][y].pathed = true;

  var upblocked = (y === 0)?true:maze[x][y-1].pathed;
  var downblocked = (y === maxheight)?true:maze[x][y+1].pathed;
  var leftblocked = (x === 0)?true:maze[x-1][y].pathed;
  var rightblocked = (x === maxwidth)?true:maze[x+1][y].pathed;

  //dead-end check
  if ((upblocked && downblocked && leftblocked && rightblocked) || (pathcount > deadthresh && Math.random() > 0.20)) {
    maze[x][y].up = maze[x][y].down = maze[x][y].left = maze[x][y].right = true;
  deadends.push([x, y, pathcount]);
  } else {

    do {

      var exitdir = Math.random() * 4;

      while (1) {
        if (exitdir < 1 && !upblocked) {
          maze[x][y].up = false;
          pathing(x, y-1, "up", pathcount+1, maxheight, maxwidth);
          upblocked = true;
          break;
        } else if (exitdir < 2 && !downblocked) {
          maze[x][y].down = false;
          pathing(x, y+1, "down", pathcount+1, maxheight, maxwidth);
          downblocked = true;
          break;
        } else if (exitdir < 3 && !leftblocked) {
          maze[x][y].left = false;
          pathing(x-1, y, "left", pathcount+1, maxheight, maxwidth);
          leftblocked = true;
          break;
        } else if (!rightblocked) {
          maze[x][y].right = false;
          pathing(x+1, y, "right", pathcount+1, maxheight, maxwidth);
          rightblocked = true;
          break;
        } else {
          exitdir += 1;
          if (exitdir > 4) {
            exitdir -= 4;
          }
        }
      }
    }
    while (Math.random() < 0.2 && !(upblocked && downblocked && leftblocked && rightblocked));
  }

  //this makes sure that there isn't a wall in the direction we came from
  //which is opposite the enterdir
  switch(enterdir) {
    case "up":
      maze[x][y].down = false;
    break;
    case "down":
      maze[x][y].up = false;
    break;
    case "left":
      maze[x][y].right = false;
    break;
    case "right":
      maze[x][y].left = false;
    break;
  }
}
