console.log("linked!");

let watsonAvgScr = 0
let watsonScr = 0
let total = 0

watsonArr = []
insideObj = new Object()

var username = "764b3285-4014-44f0-a91c-7c99f91abcba"
var password = "btTEDgvCdpcF"


function bitcoinCharts() {
  $.ajax({
    url: "http://galvanize-cors-proxy.herokuapp.com/http://api.bitcoincharts.com/v1/trades.csv\?symbol\=localbtcUSD\&start\=1489449600",
    method: "GET",
    type: 'json'
  }).then( response => {
    console.log(response);
    console.log(JSON.parse(response));
    console.log(response.slice(0,9));
      var date = new Date(response.slice(0,9)* 1000)
      console.log(date);

  }).catch( error => {
    console.log(error);
  })

}





function twittFilter(tweet) {
    function blankspace() {
        return ''
    }

    function percent20() {
        return '%20'
    }

    return tweet.replace(/[h][t][t][p]+[^\s]+/g, blankspace).replace(/[#]+/g, blankspace).replace(/[@]+/g, blankspace).replace(/[&][a][m][p][;]/g,blankspace).replace(/[\s]+/g, percent20)
}


function bitBlockRefCheck(text) {

    return /[Bb][i][t][c][o][i]+[^\s]|[Bb][l][o][c][k][c][h][a][i]+[^\s]+/g.test(text)
}

//O auth for first 200 -- OAuth oauth_consumer_key="DC0sePOBbQ8bYdC8r4Smg",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1489632301",oauth_nonce="3366654022",oauth_version="1.0",oauth_token="841456239800283136-aiCkdGp8kqWhQ4Lg8wcdxxhkXhnF8ta",oauth_signature="DLaEyBrBSvfFyN1DF0bCCNfbW3I%3D"

//https://api.twitter.com/1.1/statuses/home_timeline.json?count=200




//O auth for first ID pull -- OAuth oauth_consumer_key="DC0sePOBbQ8bYdC8r4Smg",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1489632458",oauth_nonce="-478047131",oauth_version="1.0",oauth_token="841456239800283136-aiCkdGp8kqWhQ4Lg8wcdxxhkXhnF8ta",oauth_signature="9lDn%2B5qtUWlT4Ks4931MbFrQqtk%3D"

//https://api.twitter.com/1.1/statuses/home_timeline.json?count=200&max_id=125304737


function twitterSearch() {
    console.log('time is now', Math.round(Date.now() / 1000));
    function setHeader(xhr) {
        xhr.setRequestHeader('authorization', 'OAuth oauth_consumer_key="DC0sePOBbQ8bYdC8r4Smg",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1489633016",oauth_nonce="1581578900",oauth_version="1.0",oauth_token="841456239800283136-aiCkdGp8kqWhQ4Lg8wcdxxhkXhnF8ta",oauth_signature="4O8Hl5F9r9525xAPQ4mjn9XDJEQ%3D"');
    }

    var consApiKey = "5s7gJxr2UXDooowpipihK6CMg"
    var consSecret = "OYFplU9kWtv4DY8DghjCZg2f0ONhqdIVlAlO6x9EtcLxG8q5Kz"
    let accessToken = "248899102-cMRURi2eVeGyONe5krYO8kUzed95IRQh0NnY2cpZ"
    let accessTokenSecret = "gudJvOWrwC9rOuESFqoaduCvRo3I2JkclFcnJt5j6kKoR"

    // initiate twitter GET Request

    $.ajax({
        url: "http://galvanize-cors-proxy.herokuapp.com/https://api.twitter.com/1.1/statuses/home_timeline.json?count=200&max_id=842163261403471900",
        method: "GET",
        beforeSend: setHeader,
        connection: "Keep-Alive"
    }).then(response => {
            console.log(response)
            console.log('number of tweets pulled from Tweeter : ', response.length);
            // 1. Filter through response for tweets you want

          response = response.filter( function(element, index, array) {

              return bitBlockRefCheck(element['text']) && Number(element['created_at'].slice(8, 10)) === new Date().getDate()
            },[])
            // inside of first twitter call.


            var promises = response.map(tweet => {
                return $.ajax({
                    url: "http://galvanize-cors-proxy.herokuapp.com/https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text=" + twittFilter(tweet['text']) + "&features=sentiment,keywords",
                    method: "GET",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
                    }
                }).then(function(result) {

                    // append your shit
                    $(".twitt-scroller").append('<div class="tweet-box col-xs-12">' +
                        '<div class="col-xs-10 turn-off-padding">' + '<div class="tweet-txt">' + '<img class="thumbnail img-float-text-wrap" src=' + tweet['user']['profile_image_url'] + '>' + tweet['text'] + '</div>' + '</div>' + '<div class="col-xs-2 turn-off-padding">' + '<p>' + result['sentiment']['document']['label'] + '</p>' + '<p>' + result["sentiment"]["document"]["score"] + '</p>' + '</div>' + '</div>')

                    // return result.sentiment.document.score
                    watsonScore = result["sentiment"]["document"]["score"]
                    console.log(tweet['created_at']);
                    watsonArr.push(insideObj.date = tweet['created_at'])
                    console.log('returning watson object', watsonArr);
                    return watsonScore
                }).catch(error => {

                })
            })

            // 3. Promise.all and average the result

            Promise.all(promises).then(result => {
              console.log('result of watson request', result);
                // result --> [ array of Watson scores]
                total = result.reduce( function (acc, val) {
                  return acc + val;
                }, 0)

                console.log('number of tweets sent to Watson : ', result.length);
                watsonAvgScr = (total / result.length).toFixed(2);

                function watsAvgPosOrNeg(score) {
                  console.log(score.slice(0,1));
                  if(score.slice(0,1) === '-') {
                    return '-'
                  }else {
                    return ''
                  }
                }

                let watsAvgInPercent = watsAvgPosOrNeg(watsonAvgScr) + watsonAvgScr.slice(watsonAvgScr.length-2, watsonAvgScr.length) + '%';

                watsonArr.push(insideObj.percent = watsAvgInPercent)
                console.log('watsAvgInPercent',watsAvgInPercent);

                $("#watson-percent-total").html(watsAvgInPercent)

          // else {
          //   console.log('this tweet did not pass the test   :    ', tweet['text']);
          // }
        }).catch( error => {
          console.log('this caused an error yo!', error);

        })
    }).catch( error => {
      console.log('this caused an error yo!. IM FUCKED',error);

    })
    }

    twitterSearch()
    console.log(watsonArr);
    // bitcoinCharts()
