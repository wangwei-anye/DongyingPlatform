var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({
		port: 8181
	});
wss.on('connection', function(ws) {
	console.log('client connected');
	ws.on('message', function(message) {
		console.log(message);
		ws.send(message);
	});
	setTimeout(function() {
		ws.send(JSON.stringify({
			Command: "NewAlarm"
		}));
	}, 4000);
	setTimeout(function() {
		ws.send(JSON.stringify({
			Command: "NewAlarm"
		}));
	}, 8000);
});