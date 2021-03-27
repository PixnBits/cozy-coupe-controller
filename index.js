const inputRepresentationEmitter = require('./src/input-representation');
const { addReadyListener, updateOutput, resetOutput } = require('./src/output');
const { queueShutdown, cancelShutdown } = require('./src/system');
const createVigilanceControl = require('./src/vigilanceControl');

inputRepresentationEmitter
  .on('device', ({ name }) => {
    console.log(`found input device ${name}`);
  })
  .on('error', (err) => {
    // TODO: differentiate between input disconnect errors and others
    // only device disconnect (out of range?) errors seen so far

    // reset the output to avoid zombie/sleepwalking based on the last known position
    resetOutput();

    console.error('input device error:', err);
  })
  .on('keyDown:start', queueShutdown)
  .on('keyUp:start', cancelShutdown);

addReadyListener((err) => {
  if (err) {
    console.error('output device error', err);
    process.exitCode = 1;
    throw err;
  }

  // input system (bluetooth) froze? stop moving,
  // but don't need to change steering or turn off lights
  const vigilanceControl = createVigilanceControl({ expiryWindowMS: 300 })
    .on('expired', () => {
      updateOutput({
        throttle: {
          magnitude: 0,
        },
      });
    });

  console.log('output ready');
  inputRepresentationEmitter.on('representation', (inputRepresentation) => {
    updateOutput(inputRepresentation);
    vigilanceControl.markTrigger();
  });
  console.log('input reader and output connected');
});
