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

## Usage
I'm using this parser on a Raspberry PI where I've HomeAssistant and an Mosquitto running too.
Since my Raspberry doesn't have a valid certificate, I can't publish directly from LORIOT to Mosquitto. Moreover, I'd like to parse my sensor payload in an easier way.

Therefore, LORIOT is posting sensor data through HTTP PUSH and this parser will publish the parsed payload on my MQTT broker.

![usage](https://user-images.githubusercontent.com/6308233/115861951-c9271080-a433-11eb-99e6-c85a4ed688f5.jpg)
