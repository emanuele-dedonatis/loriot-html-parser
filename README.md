# LORIOT HTML parser
Example on how to parse LORIOT HTTP push output message and publish data on MQTT.

## Instructions
Build and run the docker container
```bash
docker-compose build
docker-compose up -d
```

The service will listen for HTTP calls on port 2200 and redirect parsed data on a local mqtt broker.
file:///home/emanuele/Desktop/2021-04-21_00-06.png![image](https://user-images.githubusercontent.com/6308233/115469768-8992d580-a235-11eb-99cf-75e968b51865.png)
