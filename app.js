const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");
const {initDB, initUpdate, emitData, emitStatus} = require("./utils");
const mqttConf = require("./config");


const mqtt = require('mqtt')
const config = require('./config.json');
const { consumers } = require("stream");


let port = parseInt(mqttConf.port);
const connectUrl = `mqtts://${mqttConf.host}:${port}`;
const deviceId = mqttConf.deviceId;
const username = mqttConf.username;
const password = mqttConf.password;


const client = mqtt.connect(connectUrl, {
	deviceId,
	clean: true,
	connectTimeout: 4000,
	username: username,
	password: password,
	reconnectPeriod: 1000,
})


var topicDataOut = mqttConf.topicDataOut;
var topicStatus = mqttConf.topicStatus;
var topicUpdate = mqttConf.topicUpdate;

initDB();

function emit()
{
	setInterval(emitStatus, 10000, client);
	setInterval(emitData, 1000, client);
}

client.on('connect', async () => {
	client.subscribe(topicUpdate, () => {
		console.log(`Subscribe to topic '${topicUpdate}'`)
	})
	await emit();
})

client.on('message', (topicUpdate, payload) => {
	console.log(payload.toString());
	if (payload.toString().includes("firmware update avaliable"))
	{
		initUpdate(payload);
	}
})
