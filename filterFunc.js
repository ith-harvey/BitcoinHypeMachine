
//checks if the string 'bitcoin' or 'blockchain' are referenced in the tweet
function bitBlockRefCheck(text) {
    return /[Bb][i][t][c][o][i]+[^\s]|[Bb][l][o][c][k][c][h][a][i]+[^\s]+/g.test(text)
}

//replaces all spaces with '%20' as well as gets rid of emoticons
function filterTweet(tweet) {
  let compiledTweet = new String
  let tweetParsedArr = tweet.match(/[A-Za-z0-9 _.!/$]+/g)

  function blankspace() { return '' }
  function percent20() { return '%20' }

  //extracts every basic character so Watson doesn't break
  tweetParsedArr.forEach( miniString => {
    compiledTweet += miniString
  })
    return compiledTweet.replace(/[h][t][t][p]+[^\s]+/g, blankspace).replace(/[\s]+/g, percent20)
}

module.exports = {
  bitBlockRefCheck,
  filterTweet
}
