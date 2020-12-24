// const dashboard = require('./src/dashboard');
const inputRepresentationEmitter = require('./src/input-representation');
const { addReadyListener, updateOutput } = require('./src/output');

let enableOutput = false;

addReadyListener((err) => {
  if (err) {
    console.error('output device error', err);
    process.exitCode = 3;
    throw err;
  }
  enableOutput = true;
});

inputRepresentationEmitter.on('error', (err) => {
  console.error('input device error', err);
  // TODO: differentiate between input disconnect errors and others
  // only device disconnect (out of range?) errors seen so far
  // reset the output to avoid zombie/sleepwalking based on the last known position
  enableOutput = false;
  updateOutput({
    steering: {
      angle: 0,
    },
    throttle: {
      direction: 'S',
      magnitude: 0,
    },
  })
});

inputRepresentationEmitter.once('device', ({ name }) => {
  console.log(`reading from ${name}`);
});

inputRepresentationEmitter.on('representation', (inputRepresentation) => {
  if (enableOutput) {
    updateOutput(inputRepresentation);
  }

  // dashboard(inputRepresentation);
  // console.log(enableOutput, inputRepresentation);
});
