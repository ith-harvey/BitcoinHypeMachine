const watsonAuth = new Buffer(process.env.WATSON_USERNAME + ':' + process.env.WATSON_PASSWORD).toString('base64');
const db = require('./db')
const moment = require('moment');
const yesterday = moment().subtract(1, 'day').date()
const request = require('request')
const path = require('path')

const filterFunc = require('./filterFunc.js')

// ensures tweet was created yesterday
// ensures tweet references Bitcoin / Blockchain
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

  request(opts, watsonCallback);

  function watsonCallback(error, response, body) {
    body = JSON.parse(body)
    console.log('heres what were getting back post parse',body);


    console.log('tweet_pull_id:',tweet.id);
    console.log('date:',moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en'));
    console.log('author:',tweet.user.name);
    console.log('tweet_text:',tweet.text);
    console.log('watson_score:', body.sentiment.document.score);
    console.log('watson_label:', body.sentiment.document.label);
    console.log('profile_img:', tweet.user.profile_image_url);

    let tweetData = {
      tweet_pull_id: tweet.id,
      date: moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en'),
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
  onlyRelevantTweets,
  tweetFilter,
  watsonRequest
}
