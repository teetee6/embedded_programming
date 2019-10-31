// // 3. 버튼 누를때마다 메시지 나옴, ^ c 누르면 중단됨.(버튼 입력시 0 출력)
// //   -- -- -- -- -- -- - button.js-- -- -- -- -- -- -
// const gpio = require('node-wiring-pi');
// const BUTTON = 25;
//
// const CheckButton = function() {
//   let data = gpio.digitalRead(BUTTON);
//   if (!data)
//     console.log("Button was pressed!");
//   setTimeout(CheckButton, 300);
// }
//
// process.on('SIGINT', function() {
//   console.log("Exit...");
//   process.exit();
// });
//
// gpio.setup('wpi');
// gpio.pinMode(BUTTON, gpio.INPUT);
// setImmediate(CheckButton);


// 3. 버튼 누를때마다 메시지 나옴, ^ c 누르면 중단됨.(버튼 입력시 0 출력)
//   -- -- -- -- -- -- - button.js-- -- -- -- -- -- -
const BUTTON = 25;

var BUTTONinfo = {
    BUTTON :
};

const CheckButton = function() {
  if (!data)
    console.log("Button was pressed!");
  setTimeout(CheckButton, 300);
}

process.on('SIGINT', function() {
  console.log("Exit...");
  process.exit();
});

setImmediate(CheckButton);
