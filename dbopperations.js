const  config = require('./dbconfig');
const  sql = require('mssql');

async  function  getCalls() {
    try {
      let  pool = await  sql.connect(config);
      let  calls = await  pool.request().query("SELECT * from active_incidents WHERE type != 'ACTIVE' AND type != 'CHIABU' AND type != 'ARRWAR' AND type != '54733.57BO' AND type != 'BOLO' AND type != 'BOMREC' AND type != 'BOMBREC' AND type != 'BOMTHR' AND type != 'DOA' AND type != 'DOAHOS' AND type != 'DOATR' AND type != 'EMERG' AND type != 'EDRILL' AND type != 'EINFO' AND type != 'EPSTBY' AND type != 'ESPAS' AND type != 'ETEST' AND type != 'FDRILL' AND type != 'FASPOL' AND type != 'FINFO' AND type != 'FTEST' AND type != 'HELPE' AND type != 'HELPF' AND type != 'HELPO' AND type != 'HELPP' AND type != 'HOSTAG' AND type != 'HYDRAN' AND type != 'MENTAL' AND type != 'NUCINC' AND type != 'PINFO' AND type != 'PSYCH' AND type != 'PTEST1' AND type != 'PTEST2' AND type != 'PTEST3' AND type != 'PW' AND type != 'RAPE' AND type != 'RAPATT' AND type != 'SEXEXP' AND type != 'SEXMED' AND type != 'SEXOFF' AND type != 'SHOOTER' AND type != 'SIREN' AND type != 'SRCHWR' AND type != 'SIA' AND type != 'SPRINK' AND type != 'SUIATT' AND type != 'SUICID' AND type != 'SUITHR' AND type != 'SUSPAK' AND type != 'TAZED' AND type != 'TEST' AND type != 'TRANSA' AND type != 'TRANSJ' AND type != 'TRAFFIC' AND type != 'WARSER' AND type != 'WATCH' AND type != 'PSPAS' AND type != 'HELPPD' AND type != 'ASSIP' AND type != 'AUTFIP' AND type != 'BURGIP' AND type != 'DISPREV' AND type != 'DOMASLT' AND type != 'DOMVIO' AND type != 'FIGHT' AND type != 'HOMIVA' AND type != 'ROBBUS' AND type != 'ROBIP' AND type != 'ALABUR' AND type != 'SUSPER' AND type != 'SUSVEH' AND type != 'SUSACT' AND type != 'THEFIP' AND jurisdiction != 'Soddy Daisy PD' AND jurisdiction != 'Lookout Mountain PD' AND jurisdiction != 'UTC' AND jurisdiction != 'Soddy Daisy FD' AND jurisdiction != 'Lookout Mountain PD' AND location != '2600 IGOU FERRY RD' ORDER BY creation DESC");
      return  calls.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

  module.exports = {
    getCalls: getCalls
  }