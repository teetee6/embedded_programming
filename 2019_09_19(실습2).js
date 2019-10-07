// -----------------------------진행 로직---------------------------------
//     버튼 3초 미만 누름
//      	- B 0.5초 ON
//
//     버튼 3초 이상 누름
//       	- 부저 0.3초 ON
//     	  - 부저 OFF후, R ON
// ------------------------bellcontrol.js-------------------------------------------

const gpio = require('node-wiring-pi');
const Button ;
const Buzzer ;
const R;
const B;

var count=0;
const checkButton = function() {
  let data = gpio.digitalRead(Button);
  if(!data) {                             // 버튼이 눌리는 누적시간을 계산.
    count += 1;
  }
  else if ( data == true && count != 0 ) {      // 버튼이 떼진 상태임. && 버튼을 누른기록이 있음.
    if( count >= 10 ) {
      setImmediate( gpio.digitalWrite(Buzzer, 1) );
      setTimeout( gpio.digitalWrite(Buzzer, 0), 300 );
      setTimeout( gpio.digitalWrite(R,1), 300 );
    }
    else if( count > 0) {
      setImmediate( gpio.digitalWirte(B, 1) );
      setTimeout( gpio.digitalWirte(B,0), 500 );
    }
    count = 0;
  }

  setTimeout(CheckButton, 300);     // 0.3초후 다시 입력확인.
}


gpio.setup('wpi');
gpio.pinMode(Button, gpio.INPUT);
gpio.pinMode(Buzzer, gpio.OUTPUT);
gpio.pinMode(R, gpio.OUTPUT);
gpio.pinMode(B, gpio.OUTPUT);
