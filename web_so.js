const http = require('http');
const gpio = require('node-wiring-pi');
const fs = require('fs');
const socketio = require('socket.io');
const LED = 27;
const TRIG = 29, ECHO = 28;
var startTime, travelTime;
var index = 0, value = [];
var timerid, timeout = 800;
var cnt = 1;

const server = http.createServer(function(request, response) {
  fs.readFile('views/plotly_so.html', 'utf8', function(error, data) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(data);
  });
}).listen(65002, function() {
  gpio.wiringPiSetup();
  gpio.pinMode(LED, gpio.OUTPUT);
  gpio.pinMode(ECHO, gpio.INPUT);
  gpio.pinMode(TRIG, gpio.OUTPUT);
  gpio.digitalWrite(LED, 0);
  console.log("Server running at http://IP주소:65002");
});

const io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
  socket.on('startmsg', function(data) {
    console.log('가동메시지 수신(측정주기:%d)!', data);
    timeout = data;
    watchon();
  });

  socket.on('stopmsg', function(data) {
    console.log('중지메시지 수신!');
    clearTimeout(timerid);
  });
});

const watchon = () => {

  gpio.digitalWrite(TRIG, gpio.LOW);
  gpio.delayMicroseconds(2)
  gpio.digitalWrite(TRIG, gpio.HIGH);
  gpio.delayMicroseconds(20)
  gpio.digitalWrite(TRIG, gpio.LOW);

  while (gpio.digitalRead(ECHO) == gpio.LOW);
  startTime = gpio.micros();
  while (gpio.digitalRead(ECHO) == gpio.HIGH);
  travelTime = gpio.micros() - startTime;

  distance = travelTime / 58;
  if (distance < 400) {
    if (index < 500) {
      value[index++] = distance;
      console.log('근접거리: %d cm', value[index - 1]);
      io.sockets.emit('watch', value[index - 1]);
    } else index = 0;
    if ((index % 2) == 0)
      gpio.digitalWrite(LED, 1);
    else
      gpio.digitalWrite(LED, 0);
  }
  timerid = setTimeout(watchon, timeout);
}
