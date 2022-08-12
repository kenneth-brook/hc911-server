const  config = require('./dbconfig');
const  sql = require('mssql');

async  function  getCount() {
    try {
      let  pool = await  sql.connect(config);
      let  count = await  pool.request().query("SELECT * from count WHERE YEAR(creation) = YEAR(GETDATE())");
      console.log(count)
      return  count.recordsets;
      
    }
    catch (error) {
      console.log(error);
    }
  }

  module.exports = {
    getCount: getCount
  }