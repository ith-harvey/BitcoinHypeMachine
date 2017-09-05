const dataManip = require('../controller/index.js')
const express = require('express')
const router = express.Router();
const db = require('../db')


router.get('/', (req,res,next) => {
  db('tweets').select('*').then( tweets => {
    db('btc_prices').select('*').then( btcPrices => {

      //perform data manipulation
      tweets = dataManip.tweetToDecimal(tweets)
      let graphFinalTweets = dataManip.graphTweetObj(tweets)

      res.render('index', {tweets, btcPrices, graphFinalTweets});
    })
  }).catch( error => {
  console.log(error);
  })
})


module.exports = router;
