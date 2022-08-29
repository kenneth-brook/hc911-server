const  config = require('./dbconfig');
const  Db = require('./dbopperations');
const  CountDb = require('./CountDB');
const  express = require('express'); 
const  bodyParser = require('body-parser');
const  cors = require('cors');
const  app = express();
const  router = express.Router();
const  sql = require('mssql');
const fs = require('fs');
const https = require('https');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/hc911server.365dtm.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/hc911server.365dtm.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/hc911server.365dtm.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use('/api', router);


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

router.use((request, response, next) => {
    next();
  });

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
  
  const httpsServer = https.createServer(credentials, app);
let port = 8080;
httpsServer.listen(port, () => {
	console.log('HTTPS Server running on port 443');
});
console.log('call API is runnning at ' + port);

