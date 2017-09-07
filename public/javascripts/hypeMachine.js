//Watson averaging and storing scores variables

let ultimateWatsonObj = new Object()
let finalWatsonObj
let myprintNumberofRequestCalls = 0

console.log('here we go', window.graphTweets);
// chart variables
var myChartPrice
var myChartWats

let btcObj = {}
let btcChart = $("#btc-price-chart");
let watsChart = $("#wats-score-chart");
let tweetDayLabels = window.graphFinal.tweets.days
let btcDayLabels = window.graphFinal.btcPrices.days
let watsSentData = window.graphFinal.tweets.sentimentAvg
let btcData = window.graphFinal.btcPrices.prices

let presetData = {}
presetData.posData = [], presetData.negData =[], presetData.neutData = []

watsSentData.forEach( sentiment => {
  presetData.posData.push(1)
  presetData.negData.push(-1)
  presetData.neutData.push(0)
})


new Chart(watsChart, {
  type: 'line',
  data: {
    labels: tweetDayLabels,
    datasets: [{
        label: 'Running Sentiment',
        data: watsSentData,
        fill: false,
        borderColor: ['rgba(0,106,226,1)'],
        borderWidth: 1
      },

      {
        label: 'Positive',
        data: presetData.posData,
        fill: false,
        borderColor: ['rgba(0,106,226,1)'],
        borderWidth: 1
      },
      {
        label: 'Neutral',
        data: presetData.neutData,
        fill: false,
        borderColor: ['rgb(211,211,211)'],
        borderWidth: 1
      },
      {
        label: 'Negative',
        data: presetData.negData,
        fill: false,
        borderColor: ['rgba(255,99,132,1)'],
        borderWidth: 1
      }
    ]
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

//
new Chart(btcChart, {
  type: 'line',
  data: {
    labels: btcDayLabels,
    datasets: [{
      label: 'BTC Price',
      data: btcData,
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
