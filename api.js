const  config = require('./dbconfig');
const  Db = require('./dbopperations');
const  CountDb = require('./CountDB');
const  sql = require('mssql');
const express = require('express');
const app = express();
const  router = express.Router();
const  cors = require('cors');

const https = require('https');

const fs = require("fs");

const corsOptions = {
  origin: 'https://911activeincidents.com',
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));
app.use('/api', router);

app.use(cors({
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));



		let key = fs.readFile(`certs/private.key`, (err, data) => {
      if (err) throw err;
      key = data;
      console.log(data);
    });
		let cert = fs.readFile(`certs/certificate.pem`, (err, data) => {
      if (err) throw err;
      cert = data;
      console.log(data);
    });
    let dhparam = fs.readFile(`certs/ca_bundle.pem`, (err, data) => {
      if (err) throw err;
      dhparam = data;
      console.log(data);
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

https.createServer({key, cert, dhparam}, app).listen(8443)


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


