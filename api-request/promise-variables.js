const watsonAuth = new Buffer(process.env.WATSON_USERNAME + ':' + process.env.WATSON_PASSWORD).toString('base64');
const db = require('../db')
const moment = require('moment');
const yesterday = moment().subtract(1, 'day').date()
const request = require('request')
const twitterAPI = require('node-twitter-api');
const path = require('path')

let accessToken = process.env.ACCESS_TOKEN
let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
let rqToken
let rqTokenSecret

var counter = 0

const filterFunc = require('./filterFunc.js')


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



// ensures tweet was created yesterday
// ensures tweet references Bitcoin / Blockchain

let firstTwitterRequest = function (resolve,reject) {
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
        return resolve(firstSetTweets, idOfLastTweet)
      }
    }
  )
}



let onlyRelevantTweets = (tweet) => {
      let tweetDateDay = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').date()
      let relevantTweet = filterFunc.bitBlockRefCheck(tweet.text)

      return tweetDateDay === yesterday && relevantTweet
}

// takes out every space and adds %20 in its stead
let tweetFilter = (tweet) => {
  tweet.watson_text = filterFunc.filterTweet(tweet.text)
  return tweet
}


// fires Watson request &&
// builds 'tweetData' obj &&
// injects 'tweetData' into DB
 function watsonRequest(tweet) {
  let opts = {
    url: "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text=" + tweet.watson_text + "&features=sentiment,keywords",
    path: path,
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + watsonAuth,
      'Content-Type': 'application/json'
    }
  }

  request(opts, watsonCallback)


  function watsonCallback(error, response, body) {
    body = JSON.parse(body)
    console.log('heres what were getting back post parse', body);

    let tweetData = {
      tweet_pull_id: tweet.id,
      date: moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('LL'),
      author: tweet.user.name,
      tweet_text: tweet.text,
      watson_score: body.sentiment.document.score,
      watson_label: body.sentiment.document.label,
      profile_img: tweet.user.profile_image_url
    }

    console.log('/////heres what we are inserting ',tweetData);

    db('tweets').insert(tweetData).then(() => {
      console.log('db injection was succesfull');
    }).catch(error => {
      console.log(error);
    })
  }

  return ''
}


module.exports = {
  firstTwitterRequest,
  onlyRelevantTweets,
  initializeTwitter,
  tweetFilter,
  watsonRequest
}
