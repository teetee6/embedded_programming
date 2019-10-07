// -----------------------------진행 로직---------------------------------
//     버튼 1번누름
//     	   - 부저소리남
//     	   - B On후 Off
//     버튼 2번누름
//     	   - 부저소리남
//     	   - R On후 Off
//     버튼 3번누름
//     	   - 부저소리남
//     	   - G On후 Off               //B - R - G 순서
//     Ctrl+C
//     	   - R,G,B,부저 꺼짐
// -----------------------ledcontrol.js------------------------------------------
const gpio = require('node-wiring-pi');
const Button;
const R ;
const G ;
const B ;
const Buzzer ;

var count = 0;
const checkButton = function() {
  switch (count % 3) {
    case 0 : RingBuzzer(); OnOffLED(B);
    case 1 : RingBuzzer(); OnOffLED(R);
    case 2 : RingBuzzer(); OnOffLED(G);
    // default : break;   //(없어도됨)
  }
  count++;

  setTimeout(CheckButton, 300);
}

const RingBuzzer = function() {
  gpio.digitalWirte(Buzzer, 1);
  setTimeout(gpio.digitalWrite(Buzzer, 0), 100);
}

const OnOffLED = function(X) {
  gpio.digitalWirte(X, 1);
  setTimeout(gpio.digitalWrite(X, 0), 100);
}

process.on('SIGINT', function() {
  gpio.digitalWrite(R,0);
  gpio.digitalWrite(G,0);
  gpio.digitalWrite(B,0);
  gpio.digitalWrite(Buzzer,0);
  process.exit();
});

gpio.setup('wpi');
gpio.pinMode(Button, gpio.digitalRead);
gpio.pinMode(R, gpio.digitalWirte);
gpio.pinMode(G, gpio.digitalWirte);
gpio.pinMode(B, gpio.digitalWirte);
gpio.pinMode(Buzzer, gpio.digitalWirte);

setImmediate(checkButton);
