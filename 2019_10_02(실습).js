// -----------------------------진행 로직---------------------------------

//       버튼 누름 ( 버튼 loop반복)
//       	- G(1 --> 25 --> 49 --> 73 --> 97 ) -> B -> R -> W
//        - 버튼이 (눌렀다가 떼지는) 순간에 인터럽트 방식으로 구현.  (wiringpiISR())
//       	- 각각의 색깔이 5단계로 점점 밝아지도록 구현.    (PWM방식)
//        - 색상이 바뀔때 부저스피커 0.05초 ON     (Delay사용)

//       Ctrl+C
//       	  - 3색 LED OFF
//       	  - 부저 OFF
// -------------------------intpwm.js----------------------------------

const gpio = require('node-wiring-pi');
const R;
const G;
const B;
const Buzzer;
const Button;

var level=1;
var count=0;
const checkButton = function() {      //wiringpiISR() 메소드로, 인터럽트 발생(버튼클릭)마다 실행.
    switch( count % 4 ) {
        case 0 : showLED(G,level); break;   //빛의 세기는 softPwm방식으로 조절.
        case 1 : showLED(B,level); break;
        case 2 : showLED(R,level); break;
        case 3 : showLED(W,level); break;
    }
    level += 24;
    if( level > 100 ) {
      level = 1;
      count++;
      gpio.digitalWrite(Buzzer, 1);
      gpio.delay(50);
      gpio.digitalWrite(Buzzer, 0);
    }
}


//빛의 세기를 조절함

const showLED = function(x,y) {
    if( x == W ) {
            gpio.softPwmWrite(R,y);       // softPwmWrite()로, Duty Cycle 크기값을 저장.
            gpio.softPwmWrite(G,y);
            gpio.softPwmWrite(B,y);
    }
    else {
            gpio.softPwmWrite(x,y);
    }
}

gpio.setup('wpi');
gpio.pinmode(R, gpio.OUTPUT);
gpio.pinMode(G, gpio.OUTPUT);
gpio.pinMode(B, gpio.OUTPUT);
gpio.pinMode(Buzzer, gpio.OUTPUT);
gpio.pinMode(Button, gpio.INPUT);
gpio.wiringpiISR(Button, gpio.INT_EDGE_RISING, checkButton);    //버튼은 wiringpiISR()메소드로, 인터럽트 발생 처리.
gpio.softPwmCreate(R, 1, 100);
gpio.softPwmCreate(G, 1, 100);        //softPwmCreate()로 세기범위 지정
gpio.softPwmCreate(B, 1, 100);          
