const dashboard = require('./src/dashboard');
const inputRepresentationEmitter = require('./src/input-representation');
const { addReadyListener, updateOutput } = require('./src/output');

let enableOutput = false;

inputRepresentationEmitter.on('error', (err) => {
  console.error('input device error', err);
  process.exitCode = 2;
  throw err;
});

addReadyListener((err) => {
  if (err) {
    console.error('output device error', err);
    process.exitCode = 3;
    throw err;
  }
  enableOutput = true;
});

inputRepresentationEmitter.once('device', ({ name }) => {
  console.log(`reading from ${name}`);
});

inputRepresentationEmitter.on('representation', (inputRepresentation) => {
  if (enableOutput) {
    updateOutput(inputRepresentation);
  }

  dashboard(inputRepresentation);
});
