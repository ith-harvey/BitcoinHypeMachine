//Watson averaging and storing scores variables

let ultimateWatsonObj = new Object()
let finalWatsonObj
let myprintNumberofRequestCalls = 0


console.log('here we go', window.tweets);
// chart variables
var myChartPrice
var myChartWats


let btcObj = {}
let btcChart = $("#btc-price-chart");
let watsChart = $("#wats-score-chart");
let dayLabels = ["Sat Mar 11", "Sun Mar 12", "Mon Mar 13", "Tue Mar 14"]



new Chart(watsChart, {
  type: 'line',
  data: {
    labels: dayLabels,
    datasets: [{
        label: 'Running Sentiment',
        data: [0.5,.3,-.4,1],
        fill: false,
        borderColor: ['rgba(0,106,226,1)'],
        borderWidth: 1
      },

      {
        label: 'Positive',
        data: [1, 1, 1, 1],
        fill: false,
        borderColor: ['rgba(0,106,226,1)'],
        borderWidth: 1
      },
      {
        label: 'Neutral',
        data: [0, 0, 0, 0],
        fill: false,
        borderColor: ['rgb(211,211,211)'],
        borderWidth: 1
      },
      {
        label: 'Negative',
        data: [-1, -1, -1, -1],
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
// new Chart(btcChart, {
//   type: 'line',
//   data: {
//     labels: dayLabels,
//     datasets: [{
//       label: 'BTC Price',
//       data: btcData,
//       fill: false,
//       borderColor: ['rgba(255,99,132,1)'],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       yAxes: [{
//         scaleLabel: {
//           display: true,
//           labelString: 'US Dollars'
//         },
//         ticks: {
//           beginAtZero: true
//         }
//       }]
//     }
//   }
// });
