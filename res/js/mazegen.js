var maze = [];
var _rows = 0;
var _cols = 0;
var last = {};

//rows and cols must be positive integers 3 or greater
function mazegen(rows,cols) {
  _rows = rows;
  _cols = cols;

  var result = {
    start: {
      x: cols-2,
      y: rows-2
    },
    rows: rows,
    cols: cols
  };

  for (var i = 0; i < cols; i++) {
    maze[i] = [];
    for (var j = 0; j < rows; j++) {
      maze[i][j] = {
        wall: true
      };
    }
  }

  maze[result.start.x][result.start.y].wall = true;
  makePath({x:result.start.x, y:result.start.y-1}, 0, Math.floor(rows*cols/4));

  result.maze = maze;
  result.end = last;

  return result;

}

function makePath(point, count, prob) {
  var x = point.x;
  var y = point.y;
  var last = point;
  maze[x][y].wall = false;
  if (count < prob) {
    var neighbors = getNeighbors(point);
    var possible = [];
    for (var i = 0; i < neighbors.length; i++) {
      var point2 = neighbors[i];
      var tile = maze[point2.x][point2.y];
      if (tile.wall && point2.x !== 0 && point2.x !== (_cols-1) &&
        point2.y !== 0 && point2.y !== (_rows-1)) {
        possible.push(point2);
      }
    }
    if (possible.length > 0) {
      var rand = Math.floor(Math.random()*possible.length);
      makePath(possible[rand], count+1, prob);
    }
  }
}

function getNeighbors(point) {
  var x = point.x;
  var y = point.y;
  var result = [];
  var temp;
  temp = maze[x-1];
  if (typeof temp !== 'undefined') {
    temp = maze[x-1][y];
    if (typeof temp !== 'undefined') {
      result.push({x:x-1,y:y});
    }
  }
  temp = maze[x+1];
  if (typeof temp !== 'undefined') {
    temp = maze[x+1][y];
    if (typeof temp !== 'undefined') {
      result.push({x:x+1,y:y});
    }
  }
  temp = maze[x][y-1];
  if (typeof temp !== 'undefined') {
    result.push({x:x,y:y-1});
  }
  temp = maze[x][y+1];
  if (typeof temp !== 'undefined') {
    result.push({x:x,y:y+1});
  }
  return result;
}
