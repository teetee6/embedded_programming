// // 1. LED를 1 초간격으로 켰다 껐다를 반복하는 시스템
// // -- -- -- -- -- -- - led1.js-- -- -- -- -- -- -
// const gpio = require('node-wiring-pi');
// const LEDPIN = 29;
// var flag = 0;
//
// const TimeOutHandler = function() {
//   if (flag > 0) {
//     gpio.digitalWrite(LEDPIN, 1);
//     console.log("LED ON!");
//     flag = 0;
//   } else {
//     gpio.digitalWrite(LEDPIN, 0);
//     console.log("LED OFF!");
//     flag = 1;
//   }
//   setTimeout(TimeOutHandler, 1000);
// }
// gpio.setup('wpi');
// gpio.pinMode(LEDPIN, gpio.OUTPUT);
// setTimeout(TimeOutHandler, 1000);
// console.log("LED ON!");


const LEDPIN = 29;
var flag = 0;

const TimeOutHandler = function() {
  if (flag > 0) {
    console.log("LED ON!");
    flag = 0;
  } else {
    console.log("LED OFF!");
    flag = 1;
  }
  setTimeout(TimeOutHandler, 1000);
}
setTimeout(TimeOutHandler, 1000);
