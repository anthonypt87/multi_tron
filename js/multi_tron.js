function Game(container) {
	this.container = container;

	this.canvas = function() {
		var canvas = container.createElement("canvas");
		canvas.id = "canvas";
		canvas.width = 400;
		canvas.height = 400;
		container.body.appendChild(canvas);
		return canvas;
	}();

	this.ctx = this.canvas.getContext('2d');

	this.coordinateSystem = new CoordinateSystem(this.canvas, 15, 15);

	this.drawGrid = function(){
		this.ctx.beginPath();
		for (var x = 0; x <= this.coordinateSystem.max_x; x++) {
			var pixel_x = x * this.coordinateSystem.coordinate_x_width;
			this.ctx.moveTo(pixel_x, 0);
			this.ctx.lineTo(pixel_x, this.coordinateSystem.max_y * this.coordinateSystem.coordinate_y_width);
		}
		for (var y = 0; y <= this.coordinateSystem.max_y; y++) {
			var pixel_y = y * this.coordinateSystem.coordinate_y_width;
			this.ctx.moveTo(0, pixel_y);
			this.ctx.lineTo(this.coordinateSystem.max_x * this.coordinateSystem.coordinate_x_width, pixel_y);
		}
		this.ctx.stroke();
	};

	this.drawCar = function(x,y) {
		pixelPosition = this.coordinateSystem.getPixelPosition(x, y);
		this.ctx.fillRect(
			pixelPosition.x - (0.5 * this.coordinateSystem.coordinate_x_width),
			pixelPosition.y - (0.5 * this.coordinateSystem.coordinate_y_width),
			this.coordinateSystem.coordinate_x_width,
			this.coordinateSystem.coordinate_y_width
		);
	};

	this.start = function(){
		this.drawGrid();
		this.drawCar(1,1);
	};

}

function CoordinateSystem(canvas, max_x, max_y) {
	this.max_x = max_x;
	this.max_y = max_y;
	this.canvas = canvas;
	this.coordinate_x_width = this.canvas.width / this.max_x;
	this.coordinate_y_width = this.canvas.height / this.max_y;
	this.getPixelPosition = function(x, y) {
		var x_pixel_position = (x + 0.5) * this.coordinate_x_width;
		var y_pixel_position = (y + 0.5) * this.coordinate_y_width;
		return {'x': x_pixel_position, 'y': y_pixel_position};
	};
}

game = new Game(document);
game.start();

