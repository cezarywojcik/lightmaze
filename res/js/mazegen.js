var maze = [];
var deadends = [];
var deadthresh = 6;

function mazegen(rows,cols) {

  var maxheight = rows - 1; //counting 0
  var maxwidth = cols - 1;

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
  
  maze[start.x][start.y] = {
    pathed: true,
	isInSolution: false,
	up: false,
	down: true,
	left: true,
	right: true
  };
  
  pathing(start.x, start.y, "up", 0, maxheight, maxwidth);
  for (var i = 0; i <= maxheight; i++) { //rows
    for (var j = 0; j <= maxwidth; j++) { //columns (cells)
      if (maze[i][j].pathed = false) {
	    maze[i][j].up = false;
	    maze[i][j].down = false;
	    maze[i][j].left = false;
	    maze[i][j].right = false;
	  }
    }
  }
}

function pathing(x, y, enterdir, pathcount, maxheight, maxwidth) {

  maze[x][y].pathed = true;
  
  var upblocked = maze[x][y-1].pathed;
  var downblocked = maze[x][y+1].pathed;
  var leftblocked = maze[x-1][y].pathed;
  var rightblocked = maze[x+1][y].pathed;
  if (y==0) {
    upblocked = true;
  }
  if (y==maxheight) {
    downblocked = true;
  }
  if (x==0) {
    leftblocked = true;
  }
  if (x==maxwidth) {
    rightblocked = true;
  }
  
  //dead-end check
  if ((upblocked && downblocked && leftblocked && rightblocked)
  || (pathcount > deadthresh && Math.random() > 0.20)) {
    maze[x][y].up = maze[x][y].down = maze[x][y].left = maze[x][y].right = true;
	deadends.push([x, y, pathcount]);
  } else {
    
    var exitdir = Math.random() * 4;
    
    while (1) {
      if (exitdir < 1 && !upblocked) {
        pathing(x, y-1, "up", pathcount+1, maxheight, maxwidth);
  	    break;
      } else if (exitdir < 2 && !downblocked) {
        pathing(x, y+1, "down", pathcount+1, maxheight, maxwidth);
	    break;
      } else if (exitdir < 3 && !leftblocked) {
        pathing(x-1, y, "left", pathcount+1, maxheight, maxwidth);
	    break;
      } else if (!rightblocked) {
        pathing(x+1, y, "right", pathcount+1, maxheight, maxwidth);
	    break;
      } else {
        exitdir += 1;
	    if (exitdir > 4) {
  	      exitdir -= 4;
	    }
      }
    }
  }
  //this makes sure that there isn't a wall in the direction we came from
  
  switch(enterdir) {
  case "up":
    maze[x][y].up = false;
  break;
  case "down":
    maze[x][y].down = false;
  break;
  case "left":
    maze[x][y].left = false;
  break;
  case "right":
    maze[x][y].right = false;
  break;
  }
}