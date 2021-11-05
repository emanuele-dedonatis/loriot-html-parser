import express  from 'express';
import mqtt from 'mqtt';
import { parseLHT65 } from './dragino_lht65';
import { parseEnginko } from './enginko';

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

app.post('/lht65', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(req.body.cmd == 'rx' && req.body.data) {
        const mqttMsg = parseLHT65(req.body.port, parseHexString(req.body.data));
        console.log(`${new Date().toISOString()} [/lht65] ${JSON.stringify(mqttMsg)}`);
        mqttClient.publish(`parser/${req.body.EUI}`, JSON.stringify(mqttMsg));
    }
    res.status(204).send();
});

app.post('/enginko', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(req.body.cmd == 'rx' && req.body.data) {
        const mqttMsg = parseEnginko(req.body.port, req.body.data);
        console.log(`${new Date().toISOString()} [/lht65] ${JSON.stringify(mqttMsg)}`);
        mqttClient.publish(`parser/${req.body.EUI}`, JSON.stringify(mqttMsg));
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

function parseHexString(hexString: string): number[] {
    var result = [];
    while (hexString.length >= 1) {
        result.push(parseInt(hexString.substring(0, 2), 16));
        hexString = hexString.substring(2, hexString.length);
    }
    return result;
}