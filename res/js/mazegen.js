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
      {
        maze[i][j] = {};
        maze[i][j].pathed = false;
        if (i === 0 || j === 0 || i === maxheight || j === maxwidth) {
          maze[i][j].wall = true;
        } else {
          maze[i][j].wall =  false;
        }
      }
    }

  }

  start = {
    x: Math.floor(maxwidth/2),
    y: Math.floor(maxheight/2)
  };

  //force the start point to open upward
  maze[start.x][start.y] = {
  pathed: true,
  isInSolution: true
  };
  //put walls around the start
  maze[start.x+1][start.y].wall = true;
  maze[start.x-1][start.y].wall = true;
  maze[start.x][start.y+1].wall = true;

  //begin generation from the tile above the start
  pathing(start.x, start.y-1, "up", 0);

  return {
    start: start,
    end: {x:0, y:0},
    rows: rows,
    cols: cols,
    maze: maze
  };
}

function pathing(x, y, enterdir, pathcount) {

  maze[x][y].pathed = true;

  var upblocked = maze[x][y-1].wall;
  var downblocked = maze[x][y+1].wall;
  var leftblocked = maze[x-1][y].wall;
  var rightblocked = maze[x+1][y].wall;
  var uppathed = maze[x][y-1].pathed;
  var downpathed = maze[x][y+1].pathed;
  var leftpathed = maze[x-1][y].pathed;
  var rightpathed = maze[x+1][y].pathed;

  //dead-end check
  if ((upblocked||uppathed) && (downblocked||downpathed) && (leftblocked||leftpathed) && (rightblocked||rightpathed)/* || (pathcount > deadthresh && Math.random() > 0.20)*/) {
    deadends.push([x, y, pathcount]);
  } else {

    do {

      var exitdir = Math.random() * 4;

      while (1) {
        if (exitdir < 1 && !upblocked && !uppathed) {
          uppathed = true;
          pathing(x, y-1, "up", pathcount+1);
          break;
        } else if (exitdir < 2 && !downblocked && !downpathed) {
          downpathed = true;
          pathing(x, y+1, "down", pathcount+1);
          break;
        } else if (exitdir < 3 && !leftblocked && !leftpathed) {
          leftpathed = true;
          pathing(x-1, y, "left", pathcount+1);
          break;
        } else if (!rightblocked && !rightpathed) {
          rightpathed = true;
          pathing(x+1, y, "right", pathcount+1);
          break;
        } else {
          exitdir += 1;
          if (exitdir > 4) {
            exitdir -= 4;
          }
        }
      }
    }
    while (Math.random() < 0.2 && !((upblocked||uppathed) && (downblocked||downpathed) && (leftblocked||leftpathed) && (rightblocked||rightpathed)));
  }

  if (!uppathed) {
    maze[x][y-1].wall = true;
  }
  if (!downpathed) {
    maze[x][y+1].wall = true;
  }
  if (!leftpathed) {
    maze[x-1][y].wall = true;
  }
  if (!rightpathed) {
    maze[x+1][y].wall = true;
  }
}
