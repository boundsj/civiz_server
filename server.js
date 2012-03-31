var http = require('http'), 
	fs = require('fs');

var port = process.env.PORT || 3000;

var server = http.createServer(function (req, res) { 
    fs.readFile('index.html', function(error, data) { 
      res.writeHead(200, { 'Content-Type': 'text/html' }); 
      res.end(data, 'utf-8'); 
    }); 
  }).listen(port, "0.0.0.0");
	
var io = require('socket.io').listen(server);

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) { 
  console.log('Client connected: ' + socket.id);
  socket.on('disconnect', function () { 
    console.log('User disconnected'); 
  }); 
});

var cp = require('child_process');
var tweetNode = cp.fork(__dirname + '/tstream.js');

tweetNode.on('message', function(message) {
	io.sockets.emit('message', message);
});

