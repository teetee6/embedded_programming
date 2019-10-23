const http = require('http');       // 그냥 http하면, 매번 데이터교환하고나서 끊기니까, socket.io도 가져오자.
const gpio = require('node-wiring-pi');
const fs = require('fs');
const socketio = require('socket.io');      // socket.io는 (서버-클라이언트 간) 실.시.간. 웹통신 하게 해주는, JS library
const LED = 27;
const TRIG = 29, ECHO = 28;
var startTime, travelTime;
var index = 0, value = [];
var timerid, timeout = 800;
// var cnt = 1;

//웹 통신하고 싶으니까 -------> 'http서버' 생성
const server = http.createServer(function(request, response) {      //브라우저로부터 받고(request), 주고(response)하는 'http서버'를 만들겠다.
  fs.readFile('views/plotly_so.html', 'utf8', function(error, data) {   //http서버 만들어지면, (내가 만든) html파일을 읽어들이고
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(data);     // 그 html파일을, 브라우저에게 (200: 접근가능으로) 뿌려준다.
  });
}).listen(65002, function() {     // 65002번 포트로 접속을 하면, 하드웨어들 초기화 해주고, 위의 웹통신을 위한 http서버 구동시킴.
  gpio.wiringPiSetup();
  gpio.pinMode(LED, gpio.OUTPUT);
  gpio.pinMode(ECHO, gpio.INPUT);
  gpio.pinMode(TRIG, gpio.OUTPUT);
  gpio.digitalWrite(LED, 0);
  console.log("Server running at http://IP주소:65002");
});

// 'http서버'가 실시간 통신하고 싶으니까 -------> socketio 연결
const io = socketio.listen(server);     // 서버를 socketio에 연결해줌. (실시간통신 하려고)
io.sockets.on('connection', function(socket) {      // 클라이언트가 socket.io 서버에 접속했을 때, connection이벤트 발생. connection후, 대기상태.
  socket.on('startmsg', function(data) {          // 브라우저 --------------------> 서버
    console.log('가동메시지 수신(측정주기:%d)!', data);
    timeout = data;
    watchon();
  });

  socket.on('stopmsg', function(data) {          // 브라우저 --------------------> 서버
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
      io.sockets.emit('watch', value[index - 1]);          // 서버 --------------------> 브라우저
    } else index = 0;
    if ((index % 2) == 0)
      gpio.digitalWrite(LED, 1);
    else
      gpio.digitalWrite(LED, 0);
  }
  timerid = setTimeout(watchon, timeout);
}
