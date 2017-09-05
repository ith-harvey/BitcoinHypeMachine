
function tweetToDecimal(tweets) {
  let result = tweets.map( tweet => {
    tweet.watson_score = Number(tweet.watson_score).toFixed(2)
    return tweet
  })
  return result
}


function graphTweetObj(tweets) {
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

  // preps adds and averages tweet sentiments && asigns them to their day
  for (tweet in graphTweets) {
    let sum = graphTweets[tweet].reduce( (acc, sentiment) => {
      acc += sentiment
      return acc
    },0)
    graphTweets[tweet] = sum / tweet.length
  }

  // construct the final object -
    // graphfinalTweets = {
        // days: [day1,day2...]
        // sentimentAvg: [avgsent-day1,avgsent-day2,...]
  //   }
  let graphfinalTweets = {}
  graphfinalTweets.days = Object.keys(graphTweets)
  graphfinalTweets.sentimentAvg = []
  for (i = 0; i < Object.keys(graphTweets).length; i++) {
    graphfinalTweets.sentimentAvg.push(graphTweets[Object.keys(graphTweets)[i]])
  }
  return graphfinalTweets
}

module.exports = {
  graphTweetObj,
  tweetToDecimal
}