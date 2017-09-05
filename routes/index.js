
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

      let graphTweets = tweets.reduce( (accumulator, tweet) => {
        // if this date already exists in the object
        if(accumulator[tweet.date]) {
          // push new sentiment into arr
          accumulator[tweet.date].push(Number(tweet.watson_score))
        } else {
          //set new date's sentiment
          accumulator[tweet.date] = [Number(tweet.watson_score)]
        }
        // console.log('accum before return', accumulator);
        return accumulator
      }, {})

      for (tweet in graphTweets) {
        console.log('what we want to reduce', graphTweets[tweet]);
        let sum = graphTweets[tweet].reduce( (acc, sentiment) => {
          acc += sentiment
          return acc
        },0)
        graphTweets[tweet] = sum / tweet.length
        console.log('sum of sentiment', graphTweets[tweet]);
      }
      console.log('sum of sentiment', graphTweets);
      res.render('index', {tweets, btcPrices});
    })
  }).catch( error => {
  console.log(error);
  })
})


module.exports = router;
