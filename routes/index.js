
var express = require('express')
var router = express.Router();
var db = require('../db')


router.get('/', (req,res,next) => {
  db('tweets').select('*').then( tweets => {
    db('btc_prices').select('*').then( btcPrices => {
      tweets = tweets.map( tweet => {
        tweet.watson_score = Number(tweet.watson_score).toFixed(2)
        return tweet
      })
      console.log('///// GRAPH TWEETS', tweets[0]);

      let graphTweets = tweets.reduce( (accumulator, tweet, currentIndex, array) => {
        if(!accumulator.indexOf(tweet.date)) {
          accumulator.push(tweet.date)
        } else {
          // avg sentiment arr
        }
        return accumulator
      }, [])

      console.log('///// GRAPH TWEETS', graphTweets);

      res.render('index', {tweets, btcPrices});
    })
  }).catch( error => {
  console.log(error);
  })
})


module.exports = router;
