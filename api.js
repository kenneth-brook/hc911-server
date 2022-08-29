const https = require('https');
const express = require('express');
const fs = require("fs");

const {key, cert} = await (async () => {
	const certdir = (await fs.readdir("/etc/letsencrypt/live"))[0];

	return {
		key: await fs.readFile(`/etc/letsencrypt/live/${certdir}/privkey.pem`),
		cert: await fs.readFile(`/etc/letsencrypt/live/${certdir}/fullchain.pem`)
	}
})();

const app = express();

const httpsServer = https.createServer({key, cert}, app).listen(443, ()=>{
  console.log(key, cert);
})


async function countPush() {
  try {
    let  callsPushPool = await  sql.connect(config);
    let  callsPushCalls = await  callsPushPool.request().query("INSERT INTO count (id, creation, agency_type, jurisdiction) SELECT id, creation, agency_type, jurisdiction FROM active_incidents");
    console.log("Check to see if it worked!!!!!!");
  }
  catch (error) {
    console.log(error);
  }
}

const timer = setInterval(countPush, 600000);


