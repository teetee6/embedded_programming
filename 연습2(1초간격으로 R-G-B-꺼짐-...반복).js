// // 2. RGB LED를 1 초간격으로 R - > G - > B - > 꺼짐의 순서로 반복하는 시스템
// //   -- -- -- -- -- -- - led3.js-- -- -- -- -- -- -
// const gpio = require('node-wiring-pi');
// const BLUE = 29;
// const RED = 28;
// const GREEN = 27;
// var count = 0;
//
// const TimeOutHandler = function() {
//   switch (count % 4) {
//     case 0:
//       gpio.digitalWrite(RED, 1);
//       console.log("RED ON");
//       break;
//     case 1:
//       gpio.digitalWirte(RED, 0);
//       gpio.digitalWrite(GREEN, 1);
//       console.log("GREEN ON");
//       break;
//     case 2:
//       gpio.digitalWrite(GREEN, 0);
//       gpio.digitalWrite(BLUE, 1);
//       console.log("BLUE ON");
//       break;
//     case 3:
//       gpio.digitalWrite(RED, 0);
//       gpio.digitalWrite(GREEN, 0);
//       gpio.digitalWrite(BLUE, 0);
//       console.log("All off");
//       break;
//     default:
//       break;
//   }
//   count++;
//   setTimeout(TimeOutHandler, 1000);
// }
//
// gpio.setup('wpi');
// gpio.pinMode(RED, gpio.OUTPUT);
// gpio.pinMode(BLUE, gpio.OUTPUT);
// gpio.pinMode(GREEN, gpio.OUTPUT);
// setImmediate(TimeOutHandler);




// 2. RGB LED를 1 초간격으로 R - > G - > B - > 꺼짐의 순서로 반복하는 시스템
//   -- -- -- -- -- -- - led3.js-- -- -- -- -- -- -
const BLUE = 29;
const RED = 28;
const GREEN = 27;

var LEDinfo = {     // R,G,B의 상태를 보여주기 위한 객체. ( 0값:꺼짐,  1값:켜짐 )
   R : 0,           //하드웨어의 digitalWrite출력은, 프로그램상에서 전역변수 형식으로 비유가능.
   G : 0,
   B : 0,
};

var showLEDStatus = function() {       //
    console.log( "R=" + LEDinfo.R + "     //     " +
                  "G=" + LEDinfo.G + "     //     " +
                  "B=" + LEDinfo.B
                )
    console.log("-------------------");
}

var count = 0;

const TimeOutHandler = function() {
  switch (count % 4) {
    case 0:
      console.log("RED ON");
      LEDinfo.R = 1;              // gpio.digitalWrite(RED, 1);   에서 RED에 1값을 넣어주는 순간과 매칭됨.
      showLEDStatus();               // RED켜짐.  하드웨어 없으니 간접적으로 결과 보여줌.
      break;
    case 1:
      console.log("GREEN ON");
      LEDinfo.R = 0;
      LEDinfo.G = 1;
      showLEDStatus();
      break;
    case 2:
      console.log("BLUE ON");
      LEDinfo.G = 0;
      LEDinfo.B = 1;
      showLEDStatus();
      break;
    case 3:
      console.log("All off");
      LEDinfo.R = 0;
      LEDinfo.G = 0;
      LEDinfo.B = 0;
      showLEDStatus();
      break;
    default:
      break;
  }
  count++;
  setTimeout(TimeOutHandler, 1000);
}

setImmediate(TimeOutHandler);
