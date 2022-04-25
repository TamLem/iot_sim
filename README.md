# IOT Device Simulation

This is a node js program that create a simulated iot devices. The device simulates a firmware update protocol. The simulated IOT device constantly communicates its firmware version over an mqtt topic to a firmware update server. It also listens to an update avalaible topic to initialize a download and update of its firmware.

## Files
  - `config.json` - contains configurations to the iot devices, such as mqtt topics and connection host and port
  - `firmwareDB.json` - a json database that saves device related info, such as firmware version
  -  `utils.js` - contains modules for device routing and communication
 

## BUILD

```
  node app.js
```

