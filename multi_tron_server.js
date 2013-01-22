var http = require('http');

var server = http.createServer(
	function(request, response) {
		response.writeHead(200);
		response.end('Hello World');
	}
);
server.listen(8080);
