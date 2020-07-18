const dashboard = require('./src/dashboard');
const inputRepresentationEmitter = require('./src/input-representation');

inputRepresentationEmitter.once('device', ({ name }) => {
  console.log(`reading from ${name}`);
});

inputRepresentationEmitter.on('representation', (representation) => {
  dashboard(representation);
});
