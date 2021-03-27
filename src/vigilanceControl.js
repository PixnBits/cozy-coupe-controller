const { EventEmitter } = require('events');

function createVigilanceControl({ expiryWindowMS }) {
  if (typeof expiryWindowMS !== 'number' || Number.isNaN(expiryWindowMS)) {
    throw new TypeError('expiryWindowMS must be a number');
  }

  const vigilanceController = new EventEmitter();

  // is Date's fuzzed resolution enough or do we need process.hrtime? is hrtime too expensive?
  // esp. considering we're using an interval for checking
  let lastUpdated;
  vigilanceController.markTrigger = () => {
    lastUpdated = Date.now();
  };

  // divide the window into a few steps to minimize the time to detecting when
  // just outside of the current step
  // exceed the step window slightly to allow for a bit of drift when the
  // callback is invoked without requiring one more step after to detect expiry
  const intervalHandle = setInterval(() => {
    if ((Date.now() - lastUpdated) < expiryWindowMS) {
      return;
    }
    vigilanceController.emit('expired');
  }, Math.max(expiryWindowMS / 5 + 2, 11));
  // doesn't need to keep Node.js running
  intervalHandle.unref();

  vigilanceController.markTrigger();
  return vigilanceController;
}

module.exports = createVigilanceControl;
