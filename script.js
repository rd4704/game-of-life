/*-- script.js
//
// MAINTENANCE HISTORY
// DATE         PROGRAMMER AND DETAILS
// 08-12-15     Rahul Sharma    	Original
//
//-------------------------------------------------------------------------------------
*/
                                        
var canvascontext = document.getElementById('canvas').getContext('2d');
var canvas = document.getElementById('canvas');
canvas.addEventListener("click", canvasOnClickHandler, false);
var btnGo = document.getElementById('go');
btnGo.addEventListener("click", btnGoOnClickHandler, false);
var btnGoCrazy = document.getElementById('go-crazy');
btnGoCrazy.addEventListener("click", btnGoCrazyOnClickHandler, false);
var btnReset = document.getElementById('reset');
btnReset.addEventListener("click", btnResetOnClickHandler, false);
canvascontext.strokeStyle = 'lightgray';
canvascontext.fillStyle = '#797bff';

init_world();
init_game();
draw();

/***
 * Initialize world.
 */
function init_world() {    
    world = [];
    CELL_SIZE = 10;
    GRID_SIZE = 64;
    WORLD_DIMENSION = 512;
}

/***
 * Initialize game.
 */
function init_game() {    
	for (var i=0; i<GRID_SIZE; i++) {
		world[i] = [];
		for (var j=0; j<GRID_SIZE; j++) {
			world[i][j] = 0;
		}
	}

	// Prefilled world with a spaceship (glider)
	[
		[6, 3],[7, 4],[5,5],[6,5],[7,5],
	]
	.forEach(function(point) {
		world[point[0]][point[1]] = 1;
	});

}

/***
 * Return amount of alive neighbours for a cell
 */
function countAliveNeighbours(x, y) {
    var alive_neighbours = 0;

    function _isFilled(x, y) {
        return world[x] && world[x][y];
    }

    if (_isFilled(x-1, y-1)) alive_neighbours++;
    if (_isFilled(x,   y-1)) alive_neighbours++;
    if (_isFilled(x+1, y-1)) alive_neighbours++;
    if (_isFilled(x-1, y  )) alive_neighbours++;
    if (_isFilled(x+1, y  )) alive_neighbours++;
    if (_isFilled(x-1, y+1)) alive_neighbours++;
    if (_isFilled(x,   y+1)) alive_neighbours++;
    if (_isFilled(x+1, y+1)) alive_neighbours++;

    return alive_neighbours;
}

/***
 * Check which cells are still alive.
 */
function update(crazymode) {

	var result = [];

	// compute game of life rules for each cell
	world.forEach(function(row, x) {
		result[x] = [];
		row.forEach(function(cell, y) {
			var alive = 0,
				count = countAliveNeighbours(x, y);

			if (cell > 0) {
				alive = count === 2 || count === 3 ? 1 : 0;
			} else {
				alive = count === 3 ? 1 : 0;
			}

			result[x][y] = alive;
		});
	});

	world = result;
	if(crazymode)
		keepDrawing(crazymode);
	else
		draw();
}

/**
 * Draw world on canvascontext
 */
function draw() {
	canvascontext.clearRect(0, 0, WORLD_DIMENSION, WORLD_DIMENSION);
	world.forEach(function(row, x) {
		row.forEach(function(cell, y) {
			canvascontext.beginPath();
			canvascontext.rect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
			if (cell) {
				canvascontext.fill();
			} else {
				canvascontext.stroke();
			}
		});
	});
}


/**
 * Keep drawing world on canvascontext
 */
function keepDrawing(crazymode) {
	draw();
	setTimeout(function() {update(crazymode);}, 100);
}


/**
 * Canvas click handler
 */
function canvasOnClickHandler(event) {
	var point = getCursorPosition(event);
	world[point[0]][point[1]] = (world[point[0]][point[1]] == 1)? 0 : 1;
	draw();
  };


/**
 * Go button click handler
 */
function btnGoOnClickHandler(event) {
	keepDrawing(false);
  };


/**
 * Go Crazy button click handler
 */
function btnGoCrazyOnClickHandler(event) {
	keepDrawing(true);
  };


/**
 * Reset button click handler
 */
function btnResetOnClickHandler(event) {
	location.reload(); 
  };


/**
 * function to get cursor postion on world grid
 */
function getCursorPosition(event) {
	var x;
	var y;
	if (event.pageX || event.pageY) {
	  x = event.pageX;
	  y = event.pageY;
	} else {
	  x = event.clientX
		+ document.body.scrollLeft
		+ document.documentElement.scrollLeft;
	  y = event.clientY
		+ document.body.scrollTop
		+ document.documentElement.scrollTop;
	}

    if(canvas != null) {
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
    }

	var point = [Math.floor((x - 2) / CELL_SIZE), Math.floor((y - 4) / CELL_SIZE)];
	return point;
  };