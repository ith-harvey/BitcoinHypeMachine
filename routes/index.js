
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
      let graphTweetsObj = {}

      let graphTweets = tweets.reduce( (accumulator, tweet, currentIndex, array) => {
        if(accumulator.length && graphTweetsObj[tweet.date]) {
          console.log('date matches', graphTweetsObj[tweet.date])
        } else {
          graphTweetsObj[tweet.date] = tweet.date
          accumulator.push(tweet.date)
          // avg sentiment arr
        }
        // console.log('accum before return', accumulator);
        return accumulator
      }, [])
      console.log('///// GRAPH TWEETS 1', graphTweetsObj);
      console.log('///// GRAPH TWEETS 2', graphTweets);

      res.render('index', {tweets, btcPrices});
    })
  }).catch( error => {
  console.log(error);
  })
})


module.exports = router;
