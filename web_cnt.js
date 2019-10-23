const http = require('http');
const gpio = require('node-wiring-pi');
const fs = require('fs');
const socketio = require('socket.io');
const LED = 26;
const R = 28;
const G = 29;
const B = 27;
const BUZZOR = 25;


const server = http.createServer(function(request, response) {
  fs.readFile('views/web_ui.html', 'utf8', function(error, data) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(data);
  });
}).listen(65002, function() {
  gpio.wiringPiSetup();
  gpio.pinMode(LED, gpio.OUTPUT);
  gpio.pinMode(R, gpio.OUTPUT);
  gpio.pinMode(G, gpio.OUTPUT);
  gpio.pinMode(B, gpio.OUTPUT);
  gpio.pinMode(BUZZOR, gpio.OUTPUT);
  gpio.digitalWrite(LED, 0);
  gpio.digitalWrite(R, 0);
  gpio.digitalWrite(G, 0);
  gpio.digitalWrite(B, 0);
  gpio.digitalWrite(BUZZOR, 0);
  console.log("Server running at http://IP주소:65002");
});


const io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
  socket.on('LED_TOGGLE', function(data) {
    console.log("led 체크중");
    if( data == 1 )
      gpio.digitalWrite(LED, 1);
    else( data == 0)
      gpio.digitalWrite(LED, 0);
  });

  socket.on('BUZZOR_TOGGLE', function(data) {
    if( data == 1 )
      gpio.digitalWrite(BUZZOR, 1);
    else( data == 0)
      gpio.digitalWrite(BUZZOR, 0);
  });

  socket.on('R_TOGGLE', function(data) {
    if( data == 1 )
      gpio.digitalWrite(R, 1);
    else( data == 0)
      gpio.digitalWrite(R, 0);
  });

  socket.on('G_TOGGLE', function(data) {
    if( data == 1 )
      gpio.digitalWrite(G, 1);
    else( data == 0)
      gpio.digitalWrite(G, 0);
  });

  socket.on('B_TOGGLE', function(data) {
    if( data == 1 )
      gpio.digitalWrite(B, 1);
    else( data == 0)
      gpio.digitalWrite(B, 0);
  });
});
