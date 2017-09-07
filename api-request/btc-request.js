const request = require('request')
const moment = require('moment')
const db = require('../db')


function btcRequest () {
  let finalBtcObj = {}
  let opts =  {
    url: "https://api.blockchain.info/charts/market-price?timespan=1weeks&format=json",
      method: "GET",
      type: 'json'
  }
  request(opts,btcResponse)

  function btcResponse (error, response, body) {
    if(error) {
      throw new Error('Btc error', error);
    }

    body = JSON.parse(body)

    finalBtcObj.date = moment(new Date( body.values[body.values.length - 1].x * 1000 ).toString()).format('LL')

    console.log('DATE SHOULD BE YESTERDAY!!! -->>>>>',finalBtcObj);

    finalBtcObj.price = body.values[body.values.length - 1].y


    db('btc_prices').insert(finalBtcObj).then( result => {
      console.log('result of db injection!', result);
    }).catch(error => {
      console.log('btc injection error: ', error);
    })
  }

}

module.exports = {
  btcRequest
}
