const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const gpio = require('node-wiring-pi');
const mcpadc = require('mcp-spi-adc');
const mysql = require('mysql');
const CS_MCP3208 = 10
const SPI_CHANNEL = 0
const SPI_SPEED = 1000000
var minLight = 1092;
var maxLight = 4095;
var sid;
const client = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'gachon654321',
  database: 'sensordb2'
});



const lightsensor = mcpadc.openMcp3208(SPI_CHANNEL,
  {
    speedHz: SPI_SPEED
  },
  (err) => {
    console.log("MCP-ADC초기화!");
    if (err) console.log('ADC초기화실패!(HW점검!)');
  });
app.use(bodyParser.urlencoded({
  extended: false
}));

const LightDetect = () => {
  lightsensor.read((error, reading) => {
    console.log("(%d)", reading.rawValue);
    if (reading.rawValue >= minLight && reading.rawValue <= maxLight) {
      console.log("축하합니다. 1092~4095로 측정되었습니다.----->아날로그 측정값(%d)", reading.rawValue);
      console.log("sensordb2[DB]의 light테이블에 저장합시다.");
      let stamptime = new Date();
      client.query('INSERT INTO light VALUES (?,?)', [stamptime, bright], (err, result) => {
        if(err) {
            console.log("DB저장 실패!");
            console.log(err);
        }
        else console.log("DB저장 완료!");
      });
    } else
      console.log("<<<인식안함>>> 1092~4095값이 아님. ");
  });
  sid = setTimeout(LightDetect, 800);
}

const Retrieve = function() {
  let stamp_bright;
  client.query('SELECT * FROM `sonic`', function(error, results, fields) {
    console.log("----------------------------------------");
    results.forEach(function(element, i) {
      stamp_bright = '';
      stamp_bright += element.stamp.toLocaleString('ko-KR', {
        hour12: false
      }) + '.';
      stamp_bright += element.stamp.getMilliseconds() + ' ';
      stamp_bright += element.bright;
      console.log(stamp_bright);
    });
    console.log("----------------------------------------");
    setTimeout(Retrieve, 5000);
  });
}


app.get('/', (req, res) => {
  console.log("sensor 호출");
  fs.readFile('web_lightdb.html', 'utf8', (error, data) => {
    if (!error)
      res.send(data);
  });
});
app.get('/2', (req, res) => {
  console.log("조도센서 활성화 수행");
  sid = setTimeout(LightDetect, 200);
  res.redirect('/');
  setImmediate(Retrieve);
});
app.get('/3', (req, res) => {
  console.log("조도센서 비활성화 수행");
  clearTimeout(sid);
  res.redirect('/');
  clearTimeout(Retrieve);
});

process.on('SIGINT', function() {
  lightsensor.close(() => {
    console.log('MCP-ADC가해제됩니다.');
    console.log('웹서버를 종료합니다');
    process.exit();
  });
});
app.listen(60001, () => {
  gpio.wiringPiSetup();
  gpio.pinMode(CS_MCP3208, gpio.INPUT);
  console.log('-----------------------------------------');
  console.log("웹브라우져 접속주소 : http://IP주소:60001/");
  console.log('-----------------------------------------');
});
