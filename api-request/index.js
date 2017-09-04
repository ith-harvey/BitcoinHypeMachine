
const knex = require('knex')
const dotenv = require('dotenv').config()
const promiseVariables = require('./promise-variables.js')
const rp = require('request-promise');
const moment = require('moment');
const yesterday = moment().subtract(1, 'day').date()
const request = require('request')


// fire aftermath of twitter retreival :
//   filter tweets by : day(yesterday), blockchain/bitcoin regex
//   send tweets to get assessed by Watson
//   store post everything 'tweetData' obj into DB
function fireTwitWatsonProcess() {
  new Promise(promiseVariables.firstTwitterRequest).then( firstSetTweets => {

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
}

module.exports = {
  fireTwitWatsonProcess,
}
