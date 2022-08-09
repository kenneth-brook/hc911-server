const  Db = require('./dbopperations');
const  express = require('express'); 
const  bodyParser = require('body-parser');
const  cors = require('cors');
const  app = express();
const  router = express.Router();

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use('/api', router);


router.use((request, response, next) => {
    console.log('middleware');
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

let port = process.env.PORT || 8080;
app.listen(port);
console.log('call API is runnning at ' + port);