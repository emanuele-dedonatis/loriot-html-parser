# LORIOT HTML parser
Example on how to parse LORIOT HTTP push output message and publish data on MQTT.

## Instructions
Build and run the docker container
```bash
docker-compose build
docker-compose up -d
```

The service will listen for HTTP calls on port 2200 and redirect parsed data on a local mqtt broker.
![image](https://user-images.githubusercontent.com/6308233/115469970-dd9dba00-a235-11eb-8d52-ff65f008bab6.png)
