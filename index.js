const dashboard = require('./src/dashboard');
const inputRepresentationEmitter = require('./src/input-representation');

inputRepresentationEmitter.on('error', (err) => {
  console.error('input device error', err);
  process.exitCode = 1;
  throw err;
});

inputRepresentationEmitter.once('device', ({ name }) => {
  console.log(`reading from ${name}`);
});

inputRepresentationEmitter.on('representation', (representation) => {
  dashboard(representation);
});
