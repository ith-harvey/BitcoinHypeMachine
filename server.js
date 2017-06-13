const express = require('express')
const app = express()
const port = 8000
const path = require('path')
const knex = require('knex')
const db = require('./db')
const twitterAPI = require('node-twitter-api');
const hbs = require('hbs')
const request = require('request')
const dotenv = require('dotenv').config()
const filterFunc = require('./filterFunc.js')
const rp = require('request-promise');

const moment = require('moment');

const index = require('./routes/index.js')

const yesterday = moment().subtract(1, 'day').date()
console.log('this is yesterday = ', yesterday);

var accessToken = process.env.ACCESS_TOKEN
var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

var watsonAuth = new Buffer(process.env.WATSON_USERNAME + ':' + process.env.WATSON_PASSWORD).toString('base64');

var allTweets
var rqToken
var rqTokenSecret
var tweetData
let numOfTweetsFiltered = 0

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use('/', index)




var twitter = new twitterAPI({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callback: process.env.TWITTER_CONSUMER_CALLBACK
});

twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
  if (error) {
    console.log("Error getting OAuth request token : " + error);
  } else {
    rqToken = requestToken
    rqTokenSecret = requestTokenSecret
  }
});




let fireAllTweetRequests = new Promise(function firstTweetRequest(resolve, reject) {

    // FIRST request to Twitter
  return twitter.getTimeline("home",
    {count: 200},
    accessToken,
    accessTokenSecret,
    function (error, firstSetTweets, response) {
      if (error) {
        console.log('this is the first request',error);
        return reject(error)
      } else {
        console.log('total number of tweets from first pull', firstSetTweets.length);

        var idOfLastTweet = firstSetTweets[firstSetTweets.length - 1].id

        return resolve(firstSetTweets, idOfLastTweet)
      }
    }
  )
})


fireAllTweetRequests.then(function secondTweetRequest(firstSetTweets,idOfLastTweet) {

  console.log('in secondTweetRequest');

  twitter.getTimeline("home",
    {count: 200, max_id: idOfLastTweet},
    accessToken,
    accessTokenSecret,
    function(error, secondSetTweets, response) {
      if (error) {
        return reject(error)
        console.log(error);
      } else {
        console.log('secondSetTweets.length', secondSetTweets.length);
        allTweets = firstSetTweets.concat(secondSetTweets)
        console.log('allTweets.length', allTweets.length);
                // FILTERING for relevant tweets //

        let onlyRelevantTweets = (tweet) => {

          let tweetDateDay = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').date()
          let relevantTweet = filterFunc.bitBlockRefCheck(tweet.text)

          return tweetDateDay === yesterday && relevantTweet
        }

        let watsonRequest = (tweet) => {
          let opts = {
            url: "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text=" + tweet + "&features=sentiment,keywords",
            path: path,
            method: 'GET',
            headers: {
              Authorization: 'Basic ' + watsonAuth,
              'Content-Type': 'application/json'
            }
          }
          return rp(opts)
        }

        let tweetFilter = (tweet) => {
          let tweetPostFilter = filterFunc.filterTweet(tweet.text)
          return tweetPostFilter
        }

        let promises = allTweets.filter(onlyRelevantTweets).map(tweetFilter).map(watsonRequest)

        console.log('what we get back from filter = ', promises);


        //fires all promises to watson!
        Promise.all(promises).then(result => {
          console.log(result);
        })
      }
    }
  )
})
            // Initiate Watson API call & trigger callback
            // request(req,watsonCallback);

            function watsonCallback(error, response, body) {
              body = JSON.parse(body)
              console.log('heres what were getting back post parse',body);

              tweetData = {
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
                console.log('db injection was succesfull', numOfTweetsFiltered);
              }).catch(error => {
                console.log(error);
              })
            }


  app.use((err, req, res, next) => {
    res.send(err).status(err.status)
  })

  fireAllTweetRequests

  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  })
