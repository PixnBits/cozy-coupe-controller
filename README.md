# Cozy Skateboard
Motor speed controller and servo, Raspberry Pi, Xbox controller.

## Hardware

* Raspberry Pi 3B
* [Electronics-Salon RPi Power Relay Board Expansion Module](https://www.amazon.com/gp/product/B07CZL2SKN)

## Service

Ensure the `pi` user has GPIO access by adding it to the `gpio` group:
```bash
$ sudo adduser pi gpio
```

Set up the systemd service:
```bash
$ sudo ln -s ./cozy-skateboard.service /lib/systemd/system/cozy-skateboard.service
$ sudo systemctl daemon-reload
$ sudo systemtl enable cozy-skateboard
$ sudo systemctl start cozy-skateboard
```

Check to make sure there are no issues:
```bash
$ sudo systemctl status cozy-skateboard
```
