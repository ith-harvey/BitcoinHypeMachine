

function graphObj(btcPrices) {

  let graphFinalObj = {}
  graphFinalObj.days = [], graphFinalObj.prices = []

  btcPrices.forEach( btcObj => {
    graphFinalObj.days.push(btcObj.date)
    graphFinalObj.prices.push(btcObj.price)
  })

  console.log('btc obj', graphFinalObj);
  return graphFinalObj

}




module.exports = {
  graphObj,
}
