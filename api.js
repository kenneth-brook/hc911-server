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

app.use((req, res, next) => {
  // Bypass the check for /api/count if you want to allow it without the header
  if (req.path.startsWith('/api/count')) {
      return next();
  }

  // Check for the custom header (handle case differences)
  const frontendAuth = req.headers["x-frontend-auth"] || req.headers["X-Frontend-Auth"];
  console.log("Incoming Request - X-Frontend-Auth:", frontendAuth);
  if (!frontendAuth || frontendAuth !== "my-secure-token") {
      console.log("🚨 BLOCKED: Unauthorized request with missing or invalid auth token.");
      return res.status(403).json({ message: "Forbidden: Missing or invalid auth token" });
  }
  next();
});

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  const frontendAuth = req.headers["x-frontend-auth"] || req.headers["X-Frontend-Auth"];

  const allowedOrigins = ["https://www.hamiltontn911.gov"];
  const origin = req.headers.origin;

  if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ message: "Forbidden: Unauthorized origin" });
  }

  res.header("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : "https://www.hamiltontn911.gov");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Frontend-Auth");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
});
const corsOptions = {
  origin: "https://www.hamiltontn911.gov",
  methods: "GET",
  allowedHeaders: ["Content-Type", "Authorization", "X-Frontend-Auth"]
};

app.use(cors(corsOptions));
app.use('/api', router);

const excludedTypes = ["PERBURN", "EOC Activation"];
const emsTypes = [
  "ABDPN", "INJURY", "AWOBST", "ALAMED", "ALLERGIC", "AMPU", "ANSBT",
  "BABY", "BACKPN", "BLEEDING", "BURN", "CARARR", "CHESTPN", "CPR",
  "DIABET", "DIFFBR", "DROWN", "DRUGOD", "ELESH", "EXPOSURE", "EYEINJ",
  "FALL", "HEADPN", "HEART", "FALLHI", "MACHINERY", "INGEST", "INHAL",
  "PREG", "PSYCH", "SEIZE", "SICK", "STROKE", "TRAUMA", "UNCONC", "UNKMED"
];

router.route('/calls').get((req, res) => {
  Db.getCalls()
    .then((data) => {
      let calls = data[0];

      // Debug: Check what values exist in the dataset
      console.log("Before Filtering:", calls.map(r => r.type));

      // Filter out unwanted types
      calls = calls.filter(record => 
        !excludedTypes.some(excluded => 
          record.type?.toLowerCase() === excluded.toLowerCase() || 
          record.type_description?.toLowerCase() === excluded.toLowerCase()
        )
      );

      calls = calls.map(record => {
        if (emsTypes.includes(record.type)) {
          record.type = "EMS CALL";
          record.type_description = "EMS CALL";
        } else {
          record.type = record.type_description;
        }
        return record;
      });

      res.json(calls);
    })
    .catch(error => {
      console.error("Error fetching /calls:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
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
