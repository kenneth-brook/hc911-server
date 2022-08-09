const  config = require('./dbconfig');
const  sql = require('mssql');



async  function  callsGet() {
    try {
      let  callsGetPool = await  sql.connect(config);
      let  callsGetCalls = await  callsGetPool.request().query("SELECT id, creation, agency_type, jurisdiction FROM active_incidents");
      return  callsGetCalls.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

  module.exports = callsGet;