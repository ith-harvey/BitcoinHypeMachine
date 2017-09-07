const dataManipTweet = require('../controller/dataManipTweets.js')
const dataManipBtc = require('../controller/dataManipBtc.js')
const btcFunc = require('../api-request/btc-request.js')
const express = require('express')
const router = express.Router();
const db = require('../db')


router.get('/', (req,res,next) => {
  db('tweets').select('*').then( tweets => {
    db('btc_prices').select('*').then( btcPrices => {

      //perform data manipulation
      tweets = dataManipTweet.tweetToDecimal(tweets)

      let graphFinal = {
        tweets: dataManipTweet.graphObj(tweets),
        btcPrices: dataManipBtc.graphObj(btcPrices)
        }

      res.render('index', {tweets, btcPrices, graphFinal});
    })
  }).catch( error => {
  console.log(error);
  })
})


module.exports = router;
