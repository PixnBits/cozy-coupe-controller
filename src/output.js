const { Board, Servo, Relay } = require('johnny-five');
const Raspi = require('raspi-io').RaspiIO;
const board = new Board({
  io: new Raspi(),
  repl: false,
});

let readyListeners = [];
let steeringServo;
let throttleEnableRelay;
let throttleDirectionRelay;

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

  // the direction is inverted
  steeringServo.to(45 - degrees);
}

// S, F, R
function setThrottleDirection(direction) {
  // TODO: memoize
  if (!throttleDirectionRelay || !throttleEnableRelay) {
    throw new Error('throttleDirectionRelay not ready yet');
  }

  if (direction === 'S') {
    throttleEnableRelay.open();
    return;
  }

  if (direction === 'F') {
    throttleEnableRelay.close();
    throttleDirectionRelay.open();
    return;
  }

  if (direction === 'R') {
    throttleEnableRelay.close();
    throttleDirectionRelay.close();
    return;
  }

  throw new Error(`direction must be S(topped), F(orward), or R(everse), was "${direction}"`);
}

function updateOutput({ steering, throttle }) {
  setSteeringAngle(steering.angle);
  setThrottleDirection(throttle.direction);
  // setThrottleSpeed(throttle.magnitude)
}

board.on('ready', () => {
  steeringServo = new Servo({
    controller: 'PCA9685',
    address: 0x40,
    pin: 1,
  });
  steeringServo.stop();
  board.on('exit', () => { steeringServo.stop(); });

  // using a board that breaks out both Normally Open (NO) & Closed (NC) connections
  // using the NO to default to a disconnected state for safety
  const throttleEnableRelay = new Relay('P1-11');
  throttleEnableRelay.open();
  board.on('exit', () => { throttleEnableRelay.open(); });

  const throttleDirectionRelay = new Relay('P1-13');
  throttleDirectionRelay.open();
  board.on('exit', () => { throttleDirectionRelay.open(); });

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
