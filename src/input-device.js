const EvdevReader = require('evdev');

const DEVICE_PATH = '/dev/input/event0';

function createReader() {
  const inputDevice = new EvdevReader();

  inputDevice.open(DEVICE_PATH, (err, fd) => {
    if (err) {
      inputDevice.emit('error', err);
      return;
    }
    // FIXME: use ioctl to get this info to ensure it's correct
    // this data came from `$ evtest /dev/input/event0`
    const device = {
      driverVersion: '1.0.1',
      id: { bus: 0x5, vendor: 0x45e, product: 0x2e0, version: 0x903 },
      name: "Xbox Wireless Controller",
      supportedEvents: {
        EV_SYN: true,
        EV_KEY: [
          'KEY_HOMEPAGE',
          'BTN_SOUTH',
          'BTN_EAST',
          'BTN_NORTH',
          'BTN_WEST',
          'BTN_TL',
          'BTN_TR',
          'BTN_SELECT',
          'BTN_START',
          'BTN_THUMBL',
          'BTN_THUMBR',
        ],
        EV_ABS: {
          ABS_X: {
            value: 0,
            min: -32768,
            max: 32767,
            fuzz: 255,
            flat: 4095,
          },
          ABS_Y: {
            value: 0,
            min: -32768,
            max: 32767,
            fuzz: 255,
            flat: 4095,
          },
          ABS_Z: {
            value: 0,
            min: 0,
            max: 1023,
            fuzz: 3,
            flat: 63,
          },
          ABS_RX: {
            value: 0,
            min: -32768,
            max: 32767,
            fuzz: 255,
            flat: 4095,
          },
          ABS_RY: {
            value: 0,
            min: -32768,
            max: 32767,
            fuzz: 255,
            flat: 4095,
          },
          ABS_RZ: {
            value: 0,
            min: 0,
            max: 1023,
            fuzz: 3,
            flat: 63,
          },
          ABS_HAT0X: {
            value: 0,
            min: -1,
            max: 1,
          },
          ABS_HAT0Y: {
            value: 0,
            min: -1,
            max: 1,
          },
        },
        EV_MSC: [
          'MSC_SCAN'
        ],
        EV_FF: [
          'FF_RUMBLE',
          'FF_PERIODIC',
          'FF_SQUARE',
          'FF_TRIANGLE',
          'FF_SINE',
          'FF_GAIN',
        ],
      },
    };
    inputDevice.emit('ready', device);
  });

  // TODO: need to de-register this callback when the inputDevice closes/has an error?
  process.once('exit', () => inputDevice.close());

  return inputDevice;
}

module.exports = createReader;
