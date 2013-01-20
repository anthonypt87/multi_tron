function getRandomNumberInRange(max, min) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Game(canvas) {
	var gameState = {
		'coordinateSystem': new CoordinateSystem(canvas, 50, 50),
		'cars': [],
		'foodItems': []
	};
	var renderer = new gameRenderer(canvas, gameState);
	var directionReader = new DirectionReader(canvas);
	var playerCar = null;
	var makeCar = function() {
		var x = getRandomNumberInRange(0, gameState.coordinateSystem.maxX);
		var y = getRandomNumberInRange(0, gameState.coordinateSystem.maxY);
		return new Car(new Position(x, y), gameState.coordinateSystem);
	};

	this.initialize = function() {
		playerCar = makeCar();
		gameState.cars.push(playerCar);
		gameState.foodItems.push(makeFood());
		renderer.render();
	};

	var makeFood = function() {
		var x = getRandomNumberInRange(0, gameState.coordinateSystem.maxX);
		var y = getRandomNumberInRange(0, gameState.coordinateSystem.maxY);
		return new Food(new Position(x, y));
	};

	var handleEatFood = function() {
		var newFooditems = [];
		for (var foodIndex = 0; foodIndex < gameState.foodItems.length; foodIndex++) {
			var foodItem = gameState.foodItems[foodIndex];
			if (!foodItem.position.overlaps(playerCar.position)) {
				newFooditems.push(foodItem);
			} else {
				newFooditems.push(makeFood());
				playerCar.maxTailLength += 1;
			}
		}
		gameState.foodItems = newFooditems;
	};

	this.update = function() {
		direction = directionReader.getDirection();
		playerCar.updatePosition(direction);
		handleEatFood();
		renderer.render();
	};


}

function Food(position) {
	this.position = position;
}

function Position(x, y) {
	this.x = x;
	this.y = y;
	this.overlaps = function(position) {
		return this.x === position.x && this.y === position.y;
	};
}


function Car(position, coordinateSystem) {
	this.position = position;

	var velocity = [0, 0];
	var that = this;

	this.maxTailLength = 4;
	this.tail = [];

	this.updatePosition = function(direction){
		updateVelocityUsingDirection(direction);

		var oldPosition = new Position(this.position.x, this.position.y);

		var newX = this.position.x + velocity[0];
		if (newX < coordinateSystem.maxX && newX >= 0) {
			this.position.x = newX;
		}

		var newY = this.position.y + velocity[1];
		if (newY < coordinateSystem.maxY && newY >= 0) {
			this.position.y = newY;
		}

		if (!oldPosition.overlaps(this.position)) {
			updateTail(oldPosition);
		}
	};

	function updateVelocityUsingDirection(direction) {
		var directionMapping = {
			'UP': [0, -1],
			'DOWN': [0, 1],
			'LEFT': [-1, 0],
			'RIGHT': [1, 0]
		};
		if (direction in directionMapping && directionMapping) {
			var newVelocity = directionMapping[direction];
			// You can't go the opposite direction you're already facing
			if (!(newVelocity[0] === -velocity[0] && newVelocity[1] === -velocity[1])) {
				velocity = newVelocity;
			}
		}
	}

	function updateTail(oldPosition){
		that.tail.push(oldPosition);
		if (that.tail.length > that.maxTailLength) {
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
}


function gameRenderer(canvas, gameState) {

	var ctx = canvas.getContext('2d');
	var coordinateSystem = gameState.coordinateSystem;
	var coordinate_x_width = canvas.width / coordinateSystem.maxX;
	var coordinate_y_width = canvas.height / coordinateSystem.maxY;

	this.render = function() {
		clearCanvas();
		drawGrid();
		drawCars();
		drawFoodItems();
	};

	function clearCanvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function drawGrid() {
		ctx.beginPath();
		for (var x = 0; x <= coordinateSystem.maxX; x++) {
			var pixel_x = x * coordinate_x_width;
			ctx.moveTo(pixel_x, 0);
			ctx.lineTo(pixel_x, coordinateSystem.maxY * coordinate_y_width);
		}
		for (var y = 0; y <= coordinateSystem.maxY; y++) {
			var pixel_y = y * coordinate_y_width;
			ctx.moveTo(0, pixel_y);
			ctx.lineTo(coordinateSystem.maxX * coordinate_x_width, pixel_y);
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

	function drawFoodItems() {
		var foodItems = gameState.foodItems;
		for (var foodIndex = 0; foodIndex < foodItems.length; foodIndex++) {
			var food = foodItems[foodIndex];
			fillBox(food.position);
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


function CoordinateSystem(canvas, maxX, maxY) {
	this.maxX = maxX;
	this.maxY = maxY;
}


canvas = document.getElementById('canvas');
game = new Game(canvas);
game.initialize();
window.setInterval(game.update, 100);

