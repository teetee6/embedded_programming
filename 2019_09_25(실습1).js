// -----------------------------진행 로직---------------------------------
//       Touch센서 1번터치
//       	  - Buzzer 0.05초
//	        - 0.05초 후, B,G ON
//       		if(B,G ON)
//       	  	[광센서 빛센싱 ON]
//       		   	(광 밝음->어두움)
//       		         		R ON!
//       	  		(광 어두움->밝음)
//          	    			R OFF!
//       Touch센서 2번터치
//       	  - Buzzer 0.08초
//       	  - 0.08초 후, B,G OFF
//       Touch센서 3번터치
//       	  - 부저소리 0.05초 x 2번
//       	  - 0.1초 후, R,G,B OFF
//
//       Ctrl+C
//       	  - 3색 LED OFF
//       	  - 부저 OFF
// -------------------------myprg.js----------------------------------
const gpio = require('node-wiring-pi');
const R;
const G;
const B;
const Buzzer;
const Light;
const Touch;


//터치 센서
var count=0;    //터치한 횟수
var bg_on_off = 0;      // bg켜있으면 1값.  꺼있으면 0값.
const checkTouch = function() {
  var touch = gpio.digitalRead(Touch);      //touch할때마다 true
  if(touch) {
    switch( count % 3 ) {
      case 0 : gpio.digitalWrite(Buzzer, 1);
               setTimeout(gpio.digitalWirte(Buzzer, 0), 50);
               setTimeout(gpio.digitalWrite(B,1), 50);
               setTimeout(gpio.digitalWrite(G,1), 50);
               bg_on_off = 1;
               if (bg_on_off == 1)
                  setTimeout(checkLight, 50);
                count++;
                break;

      case 1 :  gpio.digitalWrite(Buzzer, 1);
               setTimeout(gpio.digitalWirte(Buzzer, 0), 80);
               setTimeout(gpio.digitalWrite(B,0), 80);
               setTimeout(gpio.digitalWrite(G,0), 80);
               bg_on_off = 0;
               count++;
               break;

      case 2 : gpio.digitalWrite(Buzzer, 1);
               setTimeout(gpio.digitalWirte(Buzzer, 0), 50);
               setTimeout(gpio.digitalWirte(Buzzer, 1), 50);
               setTimeout(gpio.digitalWirte(Buzzer, 0), 100);
               setTimeout(gpio.digitalWirte(R, 0), 100);
               setTimeout(gpio.digitalWirte(G, 0), 100);
               setTimeout(gpio.digitalWirte(B, 0), 100);
               count++;
               break;
    }
  }
  setTimeout(checkTouch, 300);
}


// 빛 변화 측정센서
var flag = 0;   //flag =1 : 이전에 밝은상태.
const checkLight = function() {     //밝->어둡: R ON!     //조도센서가 밝은상태에선 0만 출력.
  if(flag == 1 && gpio.digitalRead(Light) != 0) {      // 이전에 밝음 && 지금은 어두움
    gpio.digitalWrite(R, 1);
    flag = 0;
  }
  else if(flag == 0 && gpio.digitalRead(Light) == 0 ) {     // 이전에 어두움 && 지금은 밝음.
    gpio.digitalWrite(R, 0);
    flag = 1;
  }

  setTimeout(checkLight, 50);
}

//ctrl+c 종료
process.on('SIGINT', function() {
    gpio.digitalWirte(Buzzer, 0);
    gpio.digitalWirte(R, 0);
    gpio.digitalWirte(G, 0);
    gpio.digitalWirte(B, 0);
    process.exit();
});

gpio.setup('wpi');
gpio.pinMode(R, gpio.OUTPUT);
gpio.pinMode(G, gpio.OUTPUT);
gpio.pinMode(B, gpio.OUTPUT);
gpio.pinMode(Buzzer, gpio.OUTPUT);
gpio.pinMode(Light, gpio.INPUT);
gpio.pinMode(Touch, gpio.INPUT);
setImmediate(CheckTouch);
