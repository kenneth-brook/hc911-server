const  config = require('./dbconfig');
const  sql = require('mssql');

async  function  getCalls() {
    try {
      let  pool = await  sql.connect(config);
      let  calls = await  pool.request().query("SELECT * from active_incidents");
      return  calls.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

  module.exports = {
    getCalls: getCalls
  }