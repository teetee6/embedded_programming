const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const gpio = require('node-wiring-pi');
const mcpadc = require('mcp-spi-adc');
const CS_MCP3208 = 10;
const SPI_CHANNEL = 0;
const SPI_CHANNEL2 = 1;
const SPI_SPEED = 1000000;
var QuietSound = 1997;
var sid;
const B = 40;
const min=0;
const max=4095;
const soundsensor = mcpadc.openMcp3208(SPI_CHANNEL,
  {
    speedHz: SPI_SPEED
  },
  (err) => {
    console.log("MCP-ADC초기화!");
    if (err) console.log('ADC초기화실패!(HW점검!)');
  }
);

const lightsensor = mcpadc.openMcp3208(SPI_CHANNEL2,
  {
    speedHz: SPI_SPEED
  },
  (err) => {
    console.log("MCP-ADC초기화!");
    if (err) console.log('ADC초기화실패!(HW점검!)');
  }
);

app.use(bodyParser.urlencoded({
  extended: false
}));


const SoundDetect = () => {
  soundsensor.read((error, reading) => {
    console.log(" ▲ ▼ (%d)", reading.rawValue);
    if (reading.rawValue > QuietSound)
      console.log("기준값:(%d), 아날로그 측정값(%d)", QuietSound, reading.rawValue);
    else
      console.log("인식안함");
  });
  sid = setTimeout(SoundDetect, 200);
}


const LightDetect = () => {
  lightsensor.read((error, reading) => {
    console.log(" 아날로그 측정값은 = (%d)", reading.rawValue);
    for(i=0; i<10; i++) {
      if(reading.rawValue < (max/10) * (i+1)) {
        console.log("아날로그 측정값(%d)으로 (%d)단계", reading.rawValue, i);
        gpio.softPwmWrite(B, reading.rawValue);
        break;
      }
    }
  });
  sid2 = setTimeout(LightDetect, 200);
}


app.get('/', (req, res) => {
  console.log("sensor 호출");
  fs.readFile('sen.html', 'utf8', (error, data) => {
    if (!error)
      res.send(data);
  });
});
app.get('/1', (req, res) => {
  console.log("사운드센서 활성화 수행");
  sid = setTimeout(SoundDetect, 200);
  res.redirect('/');
});
app.get('/0', (req, res) => {
  console.log("사운드센서 비활성화 수행");
  clearTimeout(sid);
  res.redirect('/');
});

app.get('/2', (req, res) => {
  console.log("조도센서 활성화 수행");
  sid2 = setTimeout(LightDetect, 200);
  res.redirect('/');
});

app.get('/3', (req, res) => {
  console.log("조도센서 비활성화 수행");
  clearTimeout(sid2);
  res.redirect('/');
});

app.post('/', (req, res) => {
  let body = req.body;
  console.log('기준값이 다음값으로 설정됩니다: ');
  console.log(' ==> : ' + body.threshold);
  QuietSound = body.threshold;
  res.redirect('/');
});
process.on('SIGINT', function() {
  soundsensor.close(() => {
    console.log('MCP-ADC가해제됩니다.');
    console.log('웹서버를 종료합니다');
    process.exit();
  });
});
app.listen(60001, () => {
  gpio.wiringPiSetup();
  gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
  gpio.pinMode(B, gpio.OUTPUT);
  gpio.softPwmCreate(B, min, max);
  console.log('-----------------------------------------');
  console.log('사운드센서 제어용 웹서버(인식용기준값:%d)', QuietSound);
  console.log("웹브라우져 접속주소 : http://IP주소:60001/");
  console.log('-----------------------------------------');
});
