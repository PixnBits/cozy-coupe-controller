const blessed = require('blessed');

const screen = blessed.screen({ autopadding: true });

process.title = 'Cozy Skateboard Dashboard';

const body = blessed.box({
  parent: screen,
  border: {
    type: 'line',
    fg: 'black'
  }
});

const titleRow = blessed.box({
  parent: body,
  top: 'top',
  left: 'center',
  height: 1+6,
  content: '{center}Cozy Skateboard Dashboard{/center}',
  tags: true,
});

const steeringDisplay = blessed.box({
  parent: body,
  top: 1,
  height: 1+2,
  content: 'Steering: <Initializing>',
  border: {
    type: 'line',
    fg: 'black'
  }
});

const throttleDisplay = blessed.box({
  parent: body,
  top: 1+3,
  height: 1+2,
  content: 'Throttle: <Initializing>',
  border: {
    type: 'line',
    fg: 'black'
  }
});

screen.render();

function render({ steering, throttle }) {
  steeringDisplay.setContent(`Steering: ${steering.direction} ${Math.round(steering.angle)}°`);
  throttleDisplay.setContent(`Throttle: ${throttle.direction} ${Math.round(throttle.magnitude)}`);
  screen.render();
}

module.exports = render;
