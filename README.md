# Cozy Skateboard
Motor speed controller and servo, Raspberry Pi, Xbox controller.

## Hardware

* Raspberry Pi 3B
* [Electronics-Salon RPi Power Relay Board Expansion Module](https://www.amazon.com/gp/product/B07CZL2SKN)

## Service

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
