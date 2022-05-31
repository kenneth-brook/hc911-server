const  config = {
    user:  'admin365', // sql user
    password:  'MzmEG21PQSMDW4qXPsQF', //sql user password
    server:  'database-911.cfzb4vlbttqg.us-east-2.rds.amazonaws.com', // if it does not work try- localhost
    database:  'hc911_db',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
    options: { 
    trustServerCertificate: true,
    Encrypt: true,
    }
  }
  
  module.exports = config;