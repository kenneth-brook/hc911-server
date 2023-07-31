const  config = require('./dbconfig');
const  Db = require('./dbopperations');
const  CountDb = require('./CountDB');
const  CountDayDb = require('./CountDayDB');
const  express = require('express'); 
const  bodyParser = require('body-parser');
const  cors = require('cors');
const  app = express();
const  router = express.Router();
const  sql = require('mssql');



app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.header("Pragma", "no-cache"); // HTTP 1.0.
  res.header("Expires", "0"); // Proxies.
  next();
});
app.use('/api', router);

router.route('/calls').get((request, response) => {
  
  Db.getCalls().then((data) => {
    response.json(data[0]);
  })
  
});

let lastRan = null;
let builtCount = [];

router.route('/count').get((request, response) => {
  if (lastRan == null || new Date().getTime() > lastRan.getTime() + (10 * 60 * 1000)) {
    builtCount = [];
    lastRan = new Date();
    CountDb.getCount().then((data) => {
      let full = data[0]
      builtCount.splice(0, 0, full);
    })
    CountDayDb.getDayCount().then((data) => {
      let day = data[0]
      builtCount.splice(1, 0, day);
    })
    .then(response.json(builtCount));
  } else {
    response.json(builtCount)
  }
  
});

app.listen(8080)

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


