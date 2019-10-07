// -----------------------------진행 로직---------------------------------
//       Touch센서에 터치
//       	  - 1색 led가 0.2초간 켜졌다 꺼짐.
//
//       버튼 1번누름 ( 버튼 1-2-1-2번 반복)
//       	-부져소리 0.1초
//       	- 3색 LED ON
//       		if(3색 LED ON)
//       	  	[광센서 빛센싱 ON]
//       		   	(광 밝음->어두움)
//       		       -	Relay 전류 On
//       	  		(광 어두움->밝음)
//          	     -  Relay 전류 Off
//       버튼 2번누름
//       	  - 부저소리 0.1초
//       	  - 3색 LED OFF
//
//       Ctrl+C
//       	  - 3색 LED OFF
//       	  - 부저 OFF
//       	  - Relay OFF
// -------------------------mycontrol.js----------------------------------
const gpio = require('node-wiring-pi');
const R;
const G;
const B;
const Buzzer;
const Light;
const Touch;
const Relay;

//터치 센서
const checkTouch  = function() {
  var touch = gpio.digitalRead(Touch);
  if(touch) {
    gpio.digitalWrite(R, 1);
    setTimeout(gpio.digitalWirte(R,0), 200);
  }

  setTimeout(checkTouch, 400);
}

//버튼 센서
var count=0;    //터치한 횟수
var rgb_on_off = 0;//       bg켜있으면 1값.  꺼있으면 0값.
const checkButton = function() {
  var data = gpio.digitalRead(Button);//      누를때 마다 0값
  if(!data) {
    gpio.digitalWrite(Buzzer, 1);   //부저소리 0.1초
    setTimeout(gpio.digitalWirte(Buzzer, 0), 100);
    switch( count % 2 ) {
      case 0 :
                gpio.digitalWirte(R, 1);
                gpio.digitalWirte(G, 1);
                gpio.digitalWirte(B, 1);
                rgb_on_off = 1;
                if (rgb_on_off == 1)
                  setImmediate(checkLight);
                count++;
                break;

      case 1 : gpio.digitalWirte(R, 0);
               gpio.digitalWirte(G, 0);
               gpio.digitalWirte(B, 0);
               rgb_on_off=0;
               count++;
               break;
    }
  }
  setTimeout(checkButton, 300);
}


// 빛 변화 측정센서
var flag = 0;   //flag =1 : 이전에 밝은상태.
const checkLight = function() {     //밝->어둡: R ON!     //조도센서가 밝은상태에선 0만 출력.
  if(flag == 1 && gpio.digitalRead(Light) != 0) {//       이전에 밝음 --> 지금은 어두움
    flag = 0;
    gpio.digitalWrite(Relay, 1);
  }
  else if(flag == 0 && gpio.digitalRead(Light) == 0 ) {     // 이전에 어두움 --> 지금은 밝음.
    flag = 1;
    gpio.digitalWrite(Relay, 0);
  }

  setTimeout(checkLight, 50);
}

//ctrl+c 종료
process.on('SIGINT', function() {
    gpio.digitalWirte(Buzzer, 0);
    gpio.digitalWirte(R, 0);
    gpio.digitalWirte(G, 0);
    gpio.digitalWirte(B, 0);
    gpio.digitalWirte(Relay, 0);
    process.exit();
});

gpio.setup('wpi');
gpio.pinMode(R, gpio.OUTPUT);
gpio.pinMode(G, gpio.OUTPUT);
gpio.pinMode(B, gpio.OUTPUT);
gpio.pinMode(Buzzer, gpio.OUTPUT);
gpio.pinMode(Relay, gpio.OUTPUT);
gpio.pinMode(Light, gpio.INPUT);
gpio.pinMode(Touch, gpio.INPUT);
setImmediate(CheckTouch);
setImmediate(CheckButton);
