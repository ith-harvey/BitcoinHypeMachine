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
const moment = require('moment');

const index = require('./routes/index.js')

const yesterday = moment().subtract(1, 'day').date()
console.log('this is yesterday = ', yesterday);

var accessToken = process.env.ACCESS_TOKEN
var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

var allTweets
var rqToken
var rqTokenSecret
var tweetData

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use('/', index)

function twittPull() {

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

  // FIRST request to Twitter
  twitter.getTimeline("home", {
      count: 200
    },
    accessToken,
    accessTokenSecret,
    function (error, firstSetTweets, response) {
      if (error) {
        console.log('this is the first request',error);
      } else {
        console.log('total number of tweets from first pull', firstSetTweets.length);

        var numOfTweetsFiltered = 0

        var idOfLastTweet = firstSetTweets[firstSetTweets.length - 1].id
        console.error('last id of array', idOfLastTweet);



        // SECOND request to twitter

        twitter.getTimeline("home",
          {
            count: 200,
            max_id: idOfLastTweet
          },
          accessToken,
          accessTokenSecret,
          function(error, secondSetTweets, response) {
            if (error) {
              console.log(error);
            } else {
              console.log('secondSetTweets.length', secondSetTweets.length);

              allTweets = firstSetTweets.concat(secondSetTweets)
              console.log('allTweets.length', allTweets.length);

              allTweets.forEach((tweet, index, array) => {

                var tweetDateDay = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').date()

                if (tweetDateDay === yesterday && filterFunc.bitBlockRefCheck(tweet.text)) {
                  numOfTweetsFiltered += 1
                  let tweetPostFilter = filterFunc.filterTweet(tweet.text)

                  var auth = new Buffer(process.env.WATSON_USERNAME + ':' + process.env.WATSON_PASSWORD).toString('base64');

                  console.log('this is what is being sent to Watson : ', tweetPostFilter);
                  console.log(tweet.created_at);

                  var req = {
                    url: "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text=" + tweetPostFilter + "&features=sentiment,keywords",
                    path: path,
                    method: 'GET',
                    headers: {
                      Authorization: 'Basic ' + auth,
                      'Content-Type': 'application/json'
                    }
                  }

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
                }
              })
            }
          })
      }
    })
  }

  app.use((err, req, res, next) => {
    res.send(err).status(err.status)
  })

  twittPull()

  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  })
