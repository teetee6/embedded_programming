// 1. LED를 1 초간격으로 켰다 껐다를 반복하는 시스템
// -- -- -- -- -- -- - led1.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const LEDPIN = 29;
var flag = 0;

const TimeOutHandler = function() {
  if (flag > 0) {
    gpio.digitalWrite(LEDPIN, 1);
    console.log("LED ON!");
    flag = 0;
  } else {
    gpio.digitalWrite(LEDPIN, 0);
    console.log("LED OFF!");
    flag = 1;
  }
  setTimeout(TimeOutHandler, 1000);
}
gpio.setup('wpi');
gpio.pinMode(LEDPIN, gpio.OUTPUT);
setTimeout(TimeOutHandler, 1000);



// 2. RGB LED를 1 초간격으로 R - > G - > B - > 꺼짐의 순서로 반복하는 시스템
//   -- -- -- -- -- -- - led3.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const BLUE = 29;
const RED = 28;
const GREEN = 27;
var count = 0;

const TimeOutHandler = function() {
  switch (count % 4) {
    case 0:
      gpio.digitalWrite(RED, 1);
      console.log("RED ON");
      break;
    case 1:
      gpio.digitalWirte(RED, 0);
      gpio.digitalWrite(GREEN, 1);
      console.log("GREEN ON");
      break;
    case 2:
      gpio.digitalWrite(GREEN, 0);
      gpio.digitalWrite(BLUE, 1);
      console.log("BLUE ON");
      break;
    case 3:
      gpio.digitalWrite(RED, 0);
      gpio.digitalWrite(GREEN, 0);
      gpio.digitalWrite(BLUE, 0);
      console.log("All off");
      break;
    default:
      break;
  }
  count++;
  setTimeout(TimeOutHandler, 1000);
}

gpio.setup('wpi');
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
setImmediate(TimeOutHandler);



// 3. 버튼 누를때마다 메시지 나옴, ^ c 누르면 중단됨.(버튼 입력시 0 출력)
//   -- -- -- -- -- -- - button.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const BUTTON = 25;

const CheckButton = function() {
  let data = gpio.digitalRead(BUTTON);
  if (!data)
    console.log("Button was pressed!");
  setTimeout(CheckButton, 300);
}

process.on('SIGINT', function() {
  console.log("Exit...");
  process.exit();
});

gpio.setup('wpi');
gpio.pinMode(BUTTON, gpio.INPUT);
setImmediate(CheckButton);




// 4. Buzzer소리를 1 초 간격으로 On / Off하는 자바스크립트
//   -- -- -- -- -- -- - buzzer.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const BUZZER = 29;

const TurnOn = function() {
  gpio.digitalWrite(BUZZER, 1);
  console.log(" Buzzer ON!");
  setTimeout(TurnOff, 1000);
}

const TurnOff = function() {
  gpio.digitalWrite(BUZZER, 0);
  console.log(" Buzzer Off!");
  setTimeout(TurnOn, 1000);
}

process.on('SIGINT', function() {
  gpio.digitalWrite(BUZZER, 0);
  console.log("Exit....");
  process.exit();
});

gpio.setup('wpi');
gpio.pinMode(BUZZER, gpio.OUTPUT);
setImmediate(TurnOn);


// 5. R이 1 초동안 켜진 후, R이 꺼지고 100 ms동안 Buzzer 울리는 구조.무한반복.
//   -- -- -- -- -- -- - led_buzzer.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const BUZZER = 25;
const LED = 29;

const TurnOnLed = function() {
  gpio.digitalWrite(BUZZER, 0);
  gpio.digitalWrite(LED, 1);
  console.log(" LED on, Buzzer off");
  setTimeout(TurnOnBuzzer, 1000);
}

const TurnOnBuzzer = function() {
  gpio.digitalWrite(LED, 0);
  gpio.digitalWrite(BUZZER, 1);
  console.log(" LED off, Buzzer on");
  setTimeout(TurnOnLed, 200);
}

process.on('SIGINT', function() {
  gpio.digitalWrite(LED, 0);
  gpio.digitalWrite(BUZZER, 0);
  console.log("Program Exit...");
  process.exit();
});

gpio.setup('wpi');
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(LED, gpio.OUTPUT);
setTimeout(TurnOnLed, 200);



// 6.(Light를 측정하여) 어두우면 LED를 키고, 밝으면 LED를 끈다.(밝은 입력 상태시, 0 출력)
//   -- -- -- -- -- -- - light_led.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const LIGHT = 7;
const LED = 25;

const CheckLight = function() {
  gpio.digitalWrite(LED, 0); //LED를 일단 매번 꺼놓은 상태에서, 측정함
  var data = gpio.digitalRead(LIGHT);
  if (!data) {
    console.log(" Bright!!! ");
    gpio.digitalWrite(LED, 0);
  } else {
    console.log(" Dark... ");
    gpio.digitalWrite(LED, 1);
  }
  setTimeout(CheckLight, 500);
}

process.on('SIGINT', function() {
  gpio.digitalWrite(LED, 0);
  console.log("Program Exit...");
  process.exit();
});

gpio.setup('wpi');
gpio.pinMode(LIGHT, gpio.INPUT);
gpio.pinMode(LED, gpio.OUTPUT);
setTimeout(CheckLight, 200);


// 7. 터치 센싱 코드
// -- -- -- -- -- -- - touch.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const TOUCH = 23;

const CheckTouch = function() {
  var data = gpio.digitalRead(TOUCH);
  if (data)
    console.log(" Touched!! ");
  setTimeout(CheckTouch, 300);
}

process.on('SIGINT', function() {
  console.log("Program Exit...");
  process.exit();
});

gpio.setup('wpi');
gpio.pinMode(TOUCH, gpio.INPUT);
setTimeout(CheckTouch, 10);


// 8. Relay스위치 3 초 간격으로 제어(On / Off) 하는 코드
//   -- -- -- -- -- -- - relay.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const RELAY = 22;

const TurnOn = function() {
  gpio.digitalWrite(RELAY, gpio.HIGH);
  console.log("Relay on");
  setTimeout(TurnOff, 3000);
}

const TurnOff = function() {
  gpio.digitalWrite(RELAY, gpio.LOW);
  console.log("Relay off");
  setTimeout(TurnOn, 3000);
}

gpio.wiringPiSetup();
gpio.pinMode(RELAY, gpio.OUTPUT);
setTimeout(TurnOn, 200);


// 9. sound 센싱 코드
// -- -- -- -- -- -- - sound.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const SOUND = 29;
var count = 0;

const DetectSound = function() {
  let data = gpio.digitalRead(SOUND);
  if (data) {
    console.log("%d !", count++);
  }
  setTimeout(DetectSound, 10);
}

process.on('SIGINT', function() {
  console.log("Program Exit...");
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(SOUND, gpio.INPUT);
console.log("소리 탐지중..");
setTimeout(DetectSound, 10);


// 10. sound 탐지하면, 파랑색LED 키는 코드
// -- -- -- -- -- -- - led_sound.js-- -- -- -- -- -- -
const gpio = require('node-wiring-pi');
const SOUND = 7;
const BLUELED = 29;

const DetectSound = function() {
  gpio.digitalWrite(BLUELED, 0);
  var data = gpio.digitalRead(SOUND);
  if (data) {
    gpio.digitalWrite(BLUELED, 1);
    console.log("it sounds loud!");
  }
  setTimeout(DetectSound, 10);
}

process.on('SIGINT', function() {
  gpio.digitalWrite(BLUELED, 0);
  console.log("Program exit...");
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(SOUND, gpio.INPUT);
gpio.pinMode(BLUELED, gpio.OUTPUT);
console.log("소리 탐지중...");
setTimeout(DetectSound, 1);




// 11. 이벤트처리 방식으로 버튼을 클릭하면 LED를 켜지게 하는 코드
// ------------------------------Button_interrupt_handler.js------------
const gpio = require('node-wiring-pi');
const BUTTON = 29;
const LED = 7;

const DetectButton = function() {
  gpio.digitalWrite(LED,1);
  gpio.delay(50);
  gpio.digitalWirte(LED,0);
}

process.on('SIGINT', function) {
  gpio.digitalWirte(LED,0);
  console.log("Program Exit...");
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LED, gpio.OUTPUT);
console.log("이벤트방식: 버튼을 누르면 LED 켜집니다");
gpio.wiringPiISR(SOUND, gpio.INT_EDGE_RISING, DetectButton);
