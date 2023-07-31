const config = require('./dbconfig');
const sql = require('mssql');

async function getDayCount() {
    try {
      let pool = await sql.connect(config);
      let dayCount = await pool.request().query("SELECT COUNT(*) from count WHERE CAST(creation AS Date) = CAST(GETDATE() AS Date)");
      return dayCount.recordsets;
      
    }
    catch (error) {
      console.log(error);
    }
  }

  module.exports = {
    getDayCount: getDayCount
  }