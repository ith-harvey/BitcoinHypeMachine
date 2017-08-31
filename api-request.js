
const path = require('path')
const knex = require('knex')
const db = require('./db')
const twitterAPI = require('node-twitter-api');
const dotenv = require('dotenv').config()
const filterFunc = require('./filterFunc.js')
const rp = require('request-promise');
const moment = require('moment');
const yesterday = moment().subtract(1, 'day').date()
const request = require('request')

let accessToken = process.env.ACCESS_TOKEN
let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

const watsonAuth = new Buffer(process.env.WATSON_USERNAME + ':' + process.env.WATSON_PASSWORD).toString('base64');

let allTweets
let rqToken
let rqTokenSecret

var twitter = new twitterAPI({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callback: process.env.TWITTER_CONSUMER_CALLBACK
});

function initializeTwitter () {
  twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
    if (error) {
      console.log("Error getting OAuth request token : " + error);
    } else {
      rqToken = requestToken
      rqTokenSecret = requestTokenSecret
    }
  });
}

let fireTweetRequest = new Promise( (resolve, reject) => {
  // FIRST request to Twitter
  return twitter.getTimeline("home",
    {count: 200},
    accessToken,
    accessTokenSecret,
    function (error, firstSetTweets, response) {
      if (error) {
        console.log('this is the first request', error);
        return reject(error)
      } else {
        console.log('total number of tweets from first pull', firstSetTweets.length);


        var idOfLastTweet = firstSetTweets[firstSetTweets.length - 1].id
        console.log('last tweet from first pull', idOfLastTweet);
        return resolve(firstSetTweets, idOfLastTweet)
      }
    }
  )
})

// fire secondTweetRequest
fireTweetRequest.then( (firstSetTweets,idOfLastTweet) => {

  let onlyRelevantTweets = (tweet) => {
        let tweetDateDay = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').date()
        let relevantTweet = filterFunc.bitBlockRefCheck(tweet.text)

        return tweetDateDay === yesterday && relevantTweet
  }

  let tweetFilter = (tweet) => {
    tweet.watson_text = filterFunc.filterTweet(tweet.text)
    return tweet
  }

  let watsonRequest = (tweet) => {
    let opts = {
      url: "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text=" + tweet.watson_text + "&features=sentiment,keywords",
      path: path,
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + watsonAuth,
        'Content-Type': 'application/json'
      }
    }

    request(opts,watsonCallback);

    function watsonCallback(error, response, body) {
      body = JSON.parse(body)
      console.log('heres what were getting back post parse',body);
      console.log('Current tweet!',tweet);

      let tweetData = {
        tweet_pull_id: tweet.id,
        date: moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en'),
        author: tweet.user.name,
        tweet_text: tweet.text,
        watson_score: body.sentiment.document.score,
        watson_label: body.sentiment.document.label,
        profile_img: tweet.user.profile_image_url
      }

      console.log('heres what we are inserting ',tweetData);

      db('tweets').insert(tweetData).then(() => {
        console.log('db injection was succesfull');
      }).catch(error => {
        console.log(error);
      })
    }

    return ''
  }

  let promises = firstSetTweets.filter(onlyRelevantTweets).map(tweetFilter).map(watsonRequest)


  // fires all promises to watson!
  Promise.all(promises).then(result => {
    console.log('DB injection has finnished' );
  })
})

module.exports = {
  fireTweetRequest,
  initializeTwitter
}
