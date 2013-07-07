function mazegen(rows,cols) {

  var deadthresh = 6;

  var maxheight = rows - 1; //don't forget it starts at 0
  var maxwidth = cols - 1;

  for (var i = 0; i <= maxheight; i++) { //rows
  
    maze[i] = new Array(maxwidth+1);
    
    for (var j = 0; j <= maxwidth; j++) { //columns (cells)
      maze[i][j] = {
	    pathed: false,
	    
	    up: false,
	    down: false,
	    left: false,
	    right: false
	  }
    }
  
  }
  
  start = {
    x: Math.floor(maxwidth/2),
    y: Math.floor(maxheight/2)
  };
  
  maze[start.x][start.y] = {
    pathed: true,
	
	up: false,
	down: true,
	left: true,
	right: true
  };
  
  pathing(start.x, start.y, "up", 0);
  
}

function pathing(x, y, enterdir, pathcount) {

  maze[x][y].pathed = true;
  
  var upblocked = maze[x][y - 1].pathed;
  var downblocked = maze[x][y + 1].pathed;
  var leftblocked = maze[x - 1][y].pathed;
  var rightblocked = maze[x + 1][y].pathed;
  
  //dead-end check
  if ((upblocked && downblocked && leftblocked && rightblocked) || (pathcount > deadthresh && Math.random() > 0.20)) {
    maze[x][y].up = maze[x][y].down = maze[x][y].left = maze[x][y].right = true;
	endpathing(enterdir);
	return;
  }
  
  var exitdir = Math.random() * 4;
  
  while (1) {
    if (exitdir < 1 && !upblocked) {
    
	  break;
    } else if (exitdir < 2 && !downblocked) {
    
	  break;
    } else if (exitdir < 3 && !leftblocked) {
    
	  break;
    } else if (!rightblocked) {
    
	  break;
    } else {
      exitdir += 1;
	  if (exitdir > 4) {
  	    exitdir -= 4;
	  }
    }
  }
  
  
}

function endpathing(enterdir) {

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