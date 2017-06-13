
let tweet = 'Coinbase exchange has outage due to high trading volume http://www.reuters.com/article/us-coinbase-outages-idUSKBN1932D3?il=0 … #bitcoin #blockchain #Coinbase'


function tweetProcess(tweet) {
  return tweet.match(/[A-Za-z0-9 _.!/$]+/g)[0]
}

console.log(tweetProcess(tweet));
