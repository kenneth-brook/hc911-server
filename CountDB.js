const config = require('./dbconfig');
const sql = require('mssql');

async function getCount() {
    try {
      let pool = await sql.connect(config);
      let count = await pool.request().query("SELECT COUNT(*) from count WHERE YEAR(creation) = YEAR(GETDATE())");
      return count.recordsets;
      
    }
    catch (error) {
      console.log(error);
    }
  }

  module.exports = {
    getCount: getCount
  }