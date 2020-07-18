const blessed = require('blessed');

const screen = blessed.screen({ autopadding: true });

process.title = 'screen experiment';

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
  content: '{center}Cozy Skateboard{/center}',
  tags: true,
});

const steeringDisplay = blessed.box({
  parent: body,
  top: 1,
  height: 1+2,
  content: 'L 30%',
  border: {
    type: 'line',
    fg: 'black'
  }
});

const throttleDisplay = blessed.box({
  parent: body,
  top: 1+3,
  height: 1+2,
  content: 'F  99%',
  border: {
    type: 'line',
    fg: 'black'
  }
});

setTimeout(() => {
  steeringDisplay.setContent('L 20%');
  screen.render();
}, 1100);

setTimeout(() => {
  throttleDisplay.setContent('F 100%');
  screen.render();
}, 800);

screen.render();

setTimeout(() => { process.exit(); }, 2e3);
