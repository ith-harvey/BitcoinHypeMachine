const request = require('request')
const moment = require('moment')


function btcRequest () {
  let finalBtcObj = {}
  let opts =  {
    url: "https://galvanize-cors-proxy.herokuapp.com/https://api.blockchain.info/charts/market-price?timespan=1weeks&format=json",
      method: "GET",
      type: 'json'
  }

  request(opts,btcResponse)

  function btcResponse (error, response, body) {
    // console.log('error', error);
    // console.log('response', response);
    console.log('body', JSON.parse(body));
    body = JSON.parse(body)

    finalBtcObj.days = [], finalBtcObj.price = []

    body.values.forEach( set => {
      finalBtcObj.days.push(moment(new Date( set.x * 1000 ).toString()).format('LL'))
      finalBtcObj.price.push(set.y)
    })
    console.log('final obj', finalBtcObj);
  }

}

module.exports = {
  btcRequest
}
