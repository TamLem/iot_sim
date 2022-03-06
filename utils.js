const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");
const date = require('date-and-time');
const mqttConf = require("./config.json");
const cliProgress = require('cli-progress');


const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const { v4: uuidv4 } = require('uuid');

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

let topicDataOut = mqttConf.topicDataOut;
let topicStatus = mqttConf.topicStatus;

var db = new JsonDB(new Config("firmwareDB", true, true));


exports.initDB = function ()
{
	db.push("/firmware_version", uuidv4());
}


exports.initUpdate = async function (payload)
{
	console.log("Initializing Update....");
	bar1.update(100);
	await setTimeout(()=>{}, 5000);
	bar1.stop();
	console.log(FgGreen,"Finished Updating", FgWhite);
	db.push("/firmware_version", uuidv4());
	console.log(FgGreen,"Firmware updated to version ", db.getData("/firmware_version")
	, FgWhite);
}

function getRandomInt (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); 
}

exports.emitData = function(client){
	let temp =  getRandomInt(30, 50).toString();
	let time = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');   
	let id = mqttConf.deviceId;
	let gId = mqttConf.groupId;
	client.publish(topicDataOut, temp, { qos: 0, retain: false }, (error) => {
		if (error) {
			console.error(error)
		}
		else
		{
			console.log(`${FgYellow}Reporting temperature , ${id} , ${time} , ${temp}${FgWhite}`);
		}
	})
}

exports.emitStatus = function(client){
	let version = db.getData("/firmware_version");
	let time = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
	let id = mqttConf.deviceId;
	let gId = mqttConf.groupId;
	client.publish(topicDataOut, getRandomInt(30, 50).toString(), { qos: 0, retain: false }, (error) => {
		if (error) {
			console.error(error)
		}
		else
		{
			console.log(`${FgCyan} Reporting firmware version , ${time} , ${id} , ${gId} , ${version} ${FgWhite}`);
		}
	})
}

