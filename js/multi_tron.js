function Game(canvas) {
	var gameState = {
		'coordinateSystem': new CoordinateSystem(canvas, 15, 15),
		'cars': []
	};
	var renderer = new gameRenderer(canvas, gameState);
	var directionReader = new DirectionReader(canvas);
	var playerCar = new Car(new Position(1, 2), gameState.coordinateSystem);

	this.initialize = function() {
		gameState.cars.push(playerCar);
		renderer.render();
	};

	this.update = function() {
		direction = directionReader.getDirection();
		playerCar.updatePosition(direction);
		renderer.render();
	};
}

function Position(x, y) {
	this.x = x;
	this.y = y;
}


function Car(position, coordinateSystem) {
	this.position = position;

	var velocity = [0, 0];
	var that = this;

	var max_tail_length = 4;
	this.tail = [];

	this.updatePosition = function(direction){
		updateVelocityUsingDirection(direction);

		var oldPosition = new Position(this.position.x, this.position.y);

		var new_x = this.position.x + velocity[0];
		if (new_x < coordinateSystem.max_x && new_x >= 0) {
			this.position.x = new_x;
		}

		var new_y = this.position.y + velocity[1];
		if (new_y < coordinateSystem.max_y && new_y >= 0) {
			this.position.y = new_y;
		}

		updateTail(oldPosition);
	};

	function updateVelocityUsingDirection(direction) {
		var direction_mapping = {
			'UP': [0, -1],
			'DOWN': [0, 1],
			'LEFT': [-1, 0],
			'RIGHT': [1, 0]
		};
		if (direction in direction_mapping) {
			velocity = direction_mapping[direction];
		}
	}

	function updateTail(oldPosition){
		that.tail.push(oldPosition);
		if (that.tail.length > max_tail_length) {
			that.tail.shift();
		}
	}
}

function DirectionReader(container) {
	var keyCodeToDirectionMap = {
		'38': 'UP',
		'40': 'DOWN',
		'37': 'LEFT',
		'39': 'RIGHT'
	};

	var keysDown = {};

	this.getDirection = function() {
		for (var key in keysDown) {
			if (keysDown[key]) {
				return key;
			}
		}
		return null;
	};

	container.addEventListener(
		'keydown', 
		function (e) {
			for (key in keysDown) {
				keysDown[key] = false;
			}
			keysDown[keyCodeToDirectionMap[e.keyCode]] = true;
		}, 
		false
	);
//	container.addEventListener(
//		'keyup', 
//		function (e) {
//			keysDown[keyCodeToDirectionMap[e.keyCode]] = false;
//		}, 
//		false
//	);
}

function gameRenderer(canvas, gameState) {

	var ctx = canvas.getContext('2d');
	var coordinateSystem = gameState.coordinateSystem;
	var coordinate_x_width = canvas.width / coordinateSystem.max_x;
	var coordinate_y_width = canvas.height / coordinateSystem.max_y;

	this.render = function() {
		clearCanvas();
		drawGrid();
		drawCars();
	};

	function clearCanvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function drawGrid() {
		ctx.beginPath();
		for (var x = 0; x <= coordinateSystem.max_x; x++) {
			var pixel_x = x * coordinate_x_width;
			ctx.moveTo(pixel_x, 0);
			ctx.lineTo(pixel_x, coordinateSystem.max_y * coordinate_y_width);
		}
		for (var y = 0; y <= coordinateSystem.max_y; y++) {
			var pixel_y = y * coordinate_y_width;
			ctx.moveTo(0, pixel_y);
			ctx.lineTo(coordinateSystem.max_x * coordinate_x_width, pixel_y);
		}
		ctx.stroke();
	}

	function drawCars() {
		var cars = gameState.cars;
		for (var carIndex = 0; carIndex < cars.length; carIndex++) {
			var car = cars[carIndex];
			var carAndTailPositions = car.tail.concat([car.position]);
			for (var boxIndex = 0; boxIndex < carAndTailPositions.length; boxIndex++) {
				fillBox(carAndTailPositions[boxIndex]);
			}
		}
	}

	function fillBox(position) {
		pixelPosition = getPixelPosition(position);
		ctx.fillRect(
			pixelPosition.x - (0.5 * coordinate_x_width),
			pixelPosition.y - (0.5 * coordinate_y_width),
			coordinate_x_width,
			coordinate_y_width
		);
	}

	function getPixelPosition(position) {
		var x_pixel_position = (position.x + 0.5) * coordinate_x_width;
		var y_pixel_position = (position.y + 0.5) * coordinate_y_width;
		return new Position(x_pixel_position, y_pixel_position);
	}
}

function CoordinateSystem(canvas, max_x, max_y) {
	this.max_x = max_x;
	this.max_y = max_y;
}

canvas = document.getElementById('canvas');
game = new Game(canvas);
game.initialize();
window.setInterval(game.update, 100);

/*
		this.canvas = canvas;
		this.coordinate_x_width = this.canvas.width / this.max_x;
		this.coordinate_y_width = this.canvas.height / this.max_y;
		this.getPixelPosition = function(x, y) {
			var x_pixel_position = (x + 0.5) * this.coordinate_x_width;
			var y_pixel_position = (y + 0.5) * this.coordinate_y_width;
			return {'x': x_pixel_position, 'y': y_pixel_position};
		*/
