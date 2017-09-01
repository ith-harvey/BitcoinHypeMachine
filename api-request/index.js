
const knex = require('knex')

const twitterAPI = require('node-twitter-api');
const dotenv = require('dotenv').config()
const promiseVariables = require('./promise-variables.js')
const rp = require('request-promise');
const moment = require('moment');
const yesterday = moment().subtract(1, 'day').date()
const request = require('request')

let accessToken = process.env.ACCESS_TOKEN
let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

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
        return resolve(firstSetTweets, idOfLastTweet)
      }
    }
  )
})

// fire aftermath of twitter retreival :
  // filter tweets by : day(yesterday), blockchain/bitcoin regex
  // send tweets to get assessed by Watson
  // store post everything 'tweetData' obj into DB


fireTweetRequest.then( (firstSetTweets,idOfLastTweet) => {

  let promises = firstSetTweets.filter(promiseVariables.onlyRelevantTweets).map(promiseVariables.tweetFilter)

  let counter = 0

  Promise.all(promises).then(result => {
    console.log('promise chain has finnished',result.length);

    let timer = setInterval( ( ) => {
        promiseVariables.watsonRequest(result[counter])
        counter++
        if (counter === result.length) {
          clearInterval(timer)
        }
      }, 1000)

  })
})

module.exports = {
  fireTweetRequest,
  initializeTwitter
}