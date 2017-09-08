const apiRequest = require('./api-request/index.js')
const promiseVariables = require('./api-request/promise-variables.js')
const btcFunc = require('./api-request/btc-request.js')

const db = require('./db')
const moment = require('moment');
const yesterday = moment().subtract(1, 'day').format('LL')
const twoDaysAgo = moment().subtract(2, 'day').format('LL')


function runCheck() {
    console.log('running Tweet pull check & inserting to DB(scheduled job!)');

    db('tweets').select('*').where('date', yesterday).then( result => {
      if (result.length) {
        console.log('already have yesterdays tweets');
        //do nothing
      } else {
        promiseVariables.initializeTwitter()
        apiRequest.fireTwitWatsonProcess()
      }
    })

    db('btc_prices').select('*').where('date', twoDaysAgo).then ( result => {
      if (result.length) {
        console.log('already have yesterdays Btc price');
        //do nothing
      } else {
        btcFunc.btcRequest()
      }
    })
}

runCheck();
