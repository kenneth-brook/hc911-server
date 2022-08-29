const  config = require('./dbconfig');
const  Db = require('./dbopperations');
const  CountDb = require('./CountDB');
const  sql = require('mssql');
const express = require('express');
const app = express();
const  router = express.Router();

const https = require('https');

const fs = require("fs");


//const {key, cert} = await (async () => {
	//const certdir = (await fs.readdir("/etc/letsencrypt/live"))[0];

	//return {
		key = fs.readFile(`certs/private.key`, (err, data) => {
      if (err) throw err;
      console.log(data);
    });
		cert = fs.readFile(`certs/certificate.crt`, (err, data) => {
      if (err) throw err;
      console.log(data);
    });
	//}
//})();



app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

router.route('/calls').get((request, response) => {
  
  Db.getCalls().then((data) => {
    response.json(data[0]);
  })
  
});

router.route('/count').get((request, response) => {
  
  CountDb.getCount().then((data) => {
    response.json(data[0]);
  })
});

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


