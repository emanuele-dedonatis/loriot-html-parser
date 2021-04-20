# LORIOT HTML parser
Example on how to parse LORIOT HTTP push output message and publish data on MQTT.

## Instructions
Build and run the docker container
```bash
docker-compose build
docker-compose up -d
```

The service will listen for HTTP calls on port 2200 and redirect parsed data on a local mqtt broker.
