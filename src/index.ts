import express  from 'express';
import mqtt from 'mqtt';

let mqttClient = mqtt.connect();

const app = express();
app.use(express.json());

app.post('/mmite', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(req.body.cmd == 'rx' && req.body.port == 202 && req.body.data) {
        const mqttMsg = parseMicromite(parseHexString(req.body.data));
        console.log(`${new Date().toISOString()} [/mmite] ${JSON.stringify(mqttMsg)}`);
        mqttClient.publish("parser/mmite", JSON.stringify(mqttMsg));
    }
    res.status(204).send();
});

app.post('/bme280', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(req.body.cmd == 'rx' && req.body.data) {
        const mqttMsg = {t:parseInt(req.body.data, 16)/100};
        console.log(`${new Date().toISOString()} [/bme280] ${JSON.stringify(mqttMsg)}`);
        mqttClient.publish("parser/bme280", JSON.stringify(mqttMsg));
    }
    res.status(204).send();
});

/* ADD HERE YOUR ENDPOINT
app.post('/myendpoint', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(req.body.cmd == 'rx' && req.body.data) {
        mqttClient.publish("mytopic", JSON.stringify(req.body.data));
    }
    res.status(204).send();
});
*/

app.listen(2200);
console.log(`${new Date().toISOString()} loriot-html-parser is listening`);