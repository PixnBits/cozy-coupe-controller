const inputRepresentationEmitter = require('./src/input-representation');
const { addReadyListener, updateOutput } = require('./src/output');

inputRepresentationEmitter
  .on('device', ({ name }) => {
    console.log(`found input device ${name}`);
  })
  .on('error', (err) => {
    console.error('input device error:', err);
    // TODO: differentiate between input disconnect errors and others
    // only device disconnect (out of range?) errors seen so far
    // reset the output to avoid zombie/sleepwalking based on the last known position
    updateOutput({
      steering: {
        angle: 0,
      },
      throttle: {
        direction: 'S',
        magnitude: 0,
      },
      accessories: {
        frontLightBar: false,
      },
    });
  });

addReadyListener((err) => {
  if (err) {
    console.error('output device error', err);
    process.exitCode = 1;
    throw err;
  }

  console.log('output ready');
  inputRepresentationEmitter.on('representation', updateOutput);
  console.log('input reader and output connected');
});
