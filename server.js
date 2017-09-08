const express = require('express')
const app = express()
const port = process.env.PORT || '8000'
const hbs = require('hbs')
const apiRequest = require('./api-request/index.js')
const promiseVariables = require('./api-request/promise-variables.js')
const btcFunc = require('./api-request/btc-request.js')
const path = require('path')


const db = require('./db')

const index = require('./routes/index.js')

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('ifColorSet', function(score) {
  if (score > 0) {
    return 'blue'
  } else if (score < 0) {
    return 'red'
  } else {
    return 'blue-grey lighten-5'
  }
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
})


app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use('/', index)


app.use((err, req, res, next) => {
  res.send(err).status(err.status)
})

app.listen(port, () => {
  console.log(`server running on port ${port}`);
})
