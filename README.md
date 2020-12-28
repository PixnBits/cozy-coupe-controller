# Cozy Skateboard

A big remote-controlled car via Xbox One controller and Raspberry Pi.

_As with most OSS this is shared as an example of what I did as a hobby, not as a product suitable for your use; there is no warranty._

My implementation uses salvaged Powerwheels steering axle and wheels, two new motorized gearboxes mounted to a 2x10 wood plank with a [Cozy Coupe](https://www.littletikes.com/item/612060/cozy-coupe-30th-anniversary-edition/1.html) shell placed on top. It is as silly as it sounds, but it works and has quite the ground clearance so it's fun.

## Hardware

* [emergency stop push button](https://www.amazon.com/gp/product/B019DSZWPC), this is a **requirement**, don't skip this
* Raspberry Pi 3B
* [Electronics-Salon RPi Power Relay Board Expansion Module](https://www.amazon.com/gp/product/B07CZL2SKN)
* [servo hat](https://www.amazon.com/gp/product/B07H9ZTWNC)
* [high torque servo](https://www.amazon.com/gp/product/B07HNTKSZT) for steering
* [randomly-selected positional servo](https://www.amazon.com/gp/product/B07MFK266B) for a silly servo-to-potentiometer throttle signal conversion
* 12 Volt battery, like a Sealed Lead-Acid (SLA)
* [step-down buck converter](https://www.amazon.com/gp/product/B071CWMRYD) to get 5V for the Pi and servos
* [wheel motors](https://www.amazon.com/gp/product/B072F7QWBQ)
* wire, M3s, wood screws, scrap wood, hinge, other bits and bobs

There are some printed parts (ex: wheel drive conversion) that might be useful to add. For the most part, use aluminum etc. stock instead. With the goal of adjustments I tried to use threaded rod with printed couplers a bit too much in the beginning; it's much stronger to use all-metal.

### Wiring

[TODO: nice diagram]

Connect the buck converter to the battery and, using a multimeter, adjust to be just above 5V. I used 5.1V.

The throttle servo is position 0, steering is position 3. To avoid overtaxing the Pi's voltage regulator I made a harness to connect the servos directly to the buck converter.

The motor controller's direction button has a black wire, connect this to the e-stop button, then to the relay channel 2. From there the Normally Open (NO) goes to relay channel 3, with NO going to forward on the motor controller and Normally Closed (NC) going to reverse.

## Software

Install Node.js 8.x. Consider using [`nvm`](https://github.com/nvm-sh/nvm) to make updating easy.

### Pair an Xbox One Controller

```bash
echo "options bluetooth disable_ertm=Y" > /etc/modprobe.d/bluetooth.conf

# restart
bluetoothctl
scan on
# hit pair on your controller, find its Bluetooth MAC address
pair <bt-mac>
trust <bt-mac>
connect <bt-mac>
```

### Clone, Configuration, and Run

```bash
$ cd ~/
$ git clone git@github.com:PixnBits/cozy-skateboard.git
$ cd ~/cozy-skateboard
$ npm ci
```

You may need to update `src/input-device.js` for your specific controller; device capability reading isn't yet implemented (tips are welcome).

If you use different servos you may need to update `src/output.js`.

Test run using
```bash
$ sudo `which node` index.js
```

### Service

Update `ExecStart` in `cozy-skateboard.service` with the path to the Node.js binary.

Set up the systemd service:
```bash
$ sudo ln -s /home/pi/cozy-skateboard/cozy-skateboard.service /lib/systemd/system/cozy-skateboard.service
$ sudo systemctl daemon-reload
$ sudo systemctl enable cozy-skateboard
$ sudo systemctl start cozy-skateboard
```

Check to make sure there are no issues:
```bash
$ sudo systemctl status cozy-skateboard
```
