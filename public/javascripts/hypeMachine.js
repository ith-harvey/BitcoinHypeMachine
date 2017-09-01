//Watson averaging and storing scores variables

let ultimateWatsonObj = new Object()
let finalWatsonObj
let myprintNumberofRequestCalls = 0


// chart variables
var myChartPrice
var myChartWats
let btcObj = {}
let btcChart = $("#btc-price-chart");
let watsChart = $("#wats-score-chart");
let dayLabels = ["Sat Mar 11", "Sun Mar 12", "Mon Mar 13", "Tue Mar 14"]


// initiate twitter GET Request
$(".tweet-loading-graphic").slideUp(800)
// $(html).hide().appendTo(".twitt-scroller").fadeIn(1000)


new Chart(watsChart, {
  type: 'line',
  data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  })

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
