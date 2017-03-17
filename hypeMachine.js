//Watson averaging and storing scores variables
let watsonAvgScr = 0
let watsonScr = 0
let total = 0
let ultimateWatsonObj = new Object()
let finalWatsonObj
let myprintNumberofRequestCalls = 0


// user & pass for Watson API
var username = "764b3285-4014-44f0-a91c-7c99f91abcba"
var password = "btTEDgvCdpcF"

// chart variables
var myChartPrice
var myChartWats
let btcObj = {}
var btcChart = $("#btc-price-chart");
var watsChart = $("#wats-score-chart");

function twittFilter(tweet) {
    function blankspace() {
        return ''
    }

    function percent20() {
        return '%20'
    }

    return tweet.replace(/[h][t][t][p]+[^\s]+/g, blankspace).replace(/[#]+/g, blankspace).replace(/[@]+/g, blankspace).replace(/[&][a][m][p][;]/g, blankspace).replace(/[\s]+/g, percent20)
}


function bitBlockRefCheck(text) {

    return /[Bb][i][t][c][o][i]+[^\s]|[Bb][l][o][c][k][c][h][a][i]+[^\s]+/g.test(text)
}

function setHeader(xhr) {
    xhr.setRequestHeader('authorization', 'OAuth oauth_consumer_key="DC0sePOBbQ8bYdC8r4Smg",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1489754200",oauth_nonce="1303887026",oauth_version="1.0",oauth_token="841456239800283136-aiCkdGp8kqWhQ4Lg8wcdxxhkXhnF8ta",oauth_signature="BeM6bOKvz%2BRXPRwbndsPOlI0FpQ%3D"');
}

// initiate twitter GET Request

$.ajax({
    url: "https://galvanize-cors-proxy.herokuapp.com/https://api.twitter.com/1.1/statuses/home_timeline.json?count=200&max_id=842163261403471900",
    method: "GET",
    beforeSend: setHeader,
    connection: "Keep-Alive"
}).then(response => {
    // console.log('number of tweets pulled from Tweeter : ', response.length);

    // 1. Filter through response for tweets you want
    response = response.filter(function(element, index, array) {

        if (element['created_at'].slice(0, 10) === myChartPrice['data']['labels'][0].slice(0, 10)) {
            return bitBlockRefCheck(element['text'])
        } else if (element['created_at'].slice(0, 10) === myChartPrice['data']['labels'][1].slice(0, 10)) {
            return bitBlockRefCheck(element['text'])
        } else if (element['created_at'].slice(0, 10) === myChartPrice['data']['labels'][2].slice(0, 10)) {
            return bitBlockRefCheck(element['text'])
        } else if (element['created_at'].slice(0, 10) === myChartPrice['data']['labels'][3].slice(0, 10)) {
            return bitBlockRefCheck(element['text'])
        }
    })
    console.log('response1 length', response.length);

    function setHeader(xhr) {
        xhr.setRequestHeader('authorization', 'OAuth oauth_consumer_key="DC0sePOBbQ8bYdC8r4Smg",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1489754118",oauth_nonce="886683261",oauth_version="1.0",oauth_token="841456239800283136-aiCkdGp8kqWhQ4Lg8wcdxxhkXhnF8ta",oauth_signature="B82cnht4Rbfx4qy%2FFWPpmCF6SUU%3D"');
    }

    // initiate twitter GET Request

    $.ajax({
        url: "https://galvanize-cors-proxy.herokuapp.com/https://api.twitter.com/1.1/statuses/home_timeline.json?count=200&max_id=841378000545415200",
        method: "GET",
        beforeSend: setHeader,
        connection: "Keep-Alive"
    }).then(response2 => {
        console.log('number of tweets pulled from Tweeter : ', response.length);

        // 1. Filter through response for tweets you want
        response2 = response2.filter(function(element, index, array) {

            if (element['created_at'].slice(0, 10) === myChartPrice['data']['labels'][0].slice(0, 10)) {
                return bitBlockRefCheck(element['text'])
            } else if (element['created_at'].slice(0, 10) === myChartPrice['data']['labels'][1].slice(0, 10)) {
                return bitBlockRefCheck(element['text'])
            } else if (element['created_at'].slice(0, 10) === myChartPrice['data']['labels'][2].slice(0, 10)) {
                return bitBlockRefCheck(element['text'])
            } else if (element['created_at'].slice(0, 10) === myChartPrice['data']['labels'][3].slice(0, 10)) {
                return bitBlockRefCheck(element['text'])
            }
        })

        console.log('response2 length', response2.length);
        response = response.concat(response2)
        $('#total-tweets-pulled').fadeIn('slow')
        $('#total-tweets-pulled').append('<p>' + response.length + '</p>')
        console.log(response);

        var promises = response.map(tweet => {
            return $.ajax({
                url: "https://galvanize-cors-proxy.herokuapp.com/https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text=" + twittFilter(tweet['text']) + "&features=sentiment,keywords",
                method: "GET",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
                }
            }).then(function(result) {
                // console.log('result from watson', result);
                // append your shit

                $(".twitt-scroller").append('<div class="tweet-box col-xs-12">' +
                    '<div class="col-xs-7 turn-off-padding">' + '<img class="col-xs-2 thumbnail img-float-text-wrap" src=' + tweet['user']['profile_image_url'] + '>'+ '<h6 class=" username col-xs-8">' + tweet['user']['name'] +'</h6>' + '</div>' + '<div class="col-xs-5 turn-off-padding">' + '<p>' + result['sentiment']['document']['label'] + '</p>' + '<p>' + result["sentiment"]["document"]["score"] + '</p>' + '</div>' + '<div class="tweet-txt col-xs-12">' + tweet['text'] + '</div>')




                watsonScore = result["sentiment"]["document"]["score"]

                ultimateWatsonObj = {
                    tweetdate: tweet['created_at'].slice(0, 10),
                    score: watsonScore
                }
                printNumberofRequests()
                function printNumberofRequests() {
                  myprintNumberofRequestCalls += 1
                  // append to overall watson score box
                  $('#total-tweets-filtered').html('<p>' + myprintNumberofRequestCalls + '</p>')
                }
                return ultimateWatsonObj
            }).catch(error => {

            })
        })

        // 3. Promise.all and average the result

        Promise.all(promises).then(result => {
            console.log('number of tweets sent to Watson : ', result.length);
            window.wesThing = result

            console.log('result of ultWatsonResponse request', result);

            // result --> [ array of {Watson objects}]

            result = result.reduce(function(acc, tweet) {
                if (acc[tweet.tweetdate]) {
                    acc[tweet.tweetdate].push(tweet.score)
                } else {
                    acc[tweet.tweetdate] = [tweet.score]
                }
                return acc
            }, {})

            for (let i in result) {
                for (let arritem = 0; arritem < result[i].length; arritem++) {
                    total += result[i][arritem]
                }
                result[i] = total / result[i].length
                result[i] = result[i].toFixed(2)
            }
            finalWatsonObj = result
            console.log(finalWatsonObj);
            for (let i = 0; i < myChartWats['data']['labels'].length; i++) {
                console.log(finalWatsonObj[myChartWats['data']['labels'][i]])
                myChartWats.data.datasets[0].data.push(finalWatsonObj[myChartWats['data']['labels'][i]])
            }



        })
    }).catch(error => {
        console.log('this caused a Watson error yo!', error);

    })
}).catch(error => {
    console.log('this caused an error for response 2yo!.', error);

})

$.ajax({
    url: "https://galvanize-cors-proxy.herokuapp.com/https://api.blockchain.info/charts/market-price?timespan=1weeks&format=json",
    method: "GET",
    type: 'json'
}).then(response => {
    let date
    response['values'].forEach(function(object) {
        date = new Date(object['x'] * 1000)
        date = date.toString().slice(0, 10);
        btcObj[date] = object['y'].toFixed(2)
    })
    for (let i = 0; i < myChartPrice['data']['labels'].length; i++) {
        myChartPrice.data.datasets[0].data.push(btcObj[myChartPrice['data']['labels'][i].slice(0, 10)])
    }
}).catch(error => {
    console.log(error);
})



myChartPrice = new Chart(btcChart, {
    type: 'line',
    data: {
        labels: ["Sat Mar 11", "Sun Mar 12", "Mon Mar 13", "Tue Mar 14"],
        datasets: [{
            label: 'BTC Price',
            data: [],
            fill: false,
            borderColor: ['rgba(255,99,132,1)'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'US Dollars'
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

myChartWats = new Chart(watsChart, {
    type: 'line',
    data: {
        labels: ["Sat Mar 11", "Sun Mar 12", "Mon Mar 13", "Tue Mar 14"],
        datasets: [{
            label: 'Neutral Sentiment',
            data: [],
            fill: false,
            borderColor: ['rgba(255,99,132,1)'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
              scaleLabel: {
                  display: true,
                  labelString: 'Sentiment',
                ticks: {
                    beginAtZero: true
                }
              }
            }]
        }
    }
});
