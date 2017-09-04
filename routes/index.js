
var express = require('express')
var router = express.Router();
var db = require('../db')


router.get('/', (req,res,next) => {
  db('tweets').select('*').then( tweets => {
    db('btc_prices').select('*').then( btc_prices => {
      tweets = tweets.map( tweet => {
        tweet.watson_score = Number(tweet.watson_score).toFixed(2)
        return tweet
      })
      res.render('index', {tweets, btc_prices});
    })
  }).catch( error => {
  console.log(error);
  })
})


module.exports = router;
