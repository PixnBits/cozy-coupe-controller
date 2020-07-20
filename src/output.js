const {Board, Servo} = require("johnny-five");
const Raspi = require("raspi-io").RaspiIO;
const board = new Board({ io: new Raspi() });

let readyListeners = [];
let steeringServo;

function addReadyListener(cb) {
  readyListeners.push(cb);
}

function setSteeringAngle(degrees) {
  if (degrees < -45 || degrees > 45) {
    throw new Error(`requested steering angle ${degrees} outside bounds of -45 to +45`);
  }
  // TODO: memoize
  if (!steeringServo) {
    throw new Error('steeringServo not ready yet');
  }
  steeringServo.to(45 + degrees);
}

function updateOutput({ steering, throttle }) {
  setSteeringAngle(steering.angle);
  // setThrottleDirection(throttle.direction)
  // setThrottleSpeed(throttle.magnitude)
}

board.on("ready", () => {
  steeringServo = new Servo({
    controller: 'PCA9685',
    address: 0x40,
    pin: 1,
  });
  steeringServo.stop();
  board.on("exit", () => { steeringServo.stop(); });

  readyListeners.forEach(cb => setImmediate(cb, null));
  delete readyListeners;
});

board.on('error', (err) => {
  readyListeners.forEach(cb => setImmediate(cb, err));
  delete readyListeners;
});

module.exports = {
  addReadyListener,
  updateOutput,
};
