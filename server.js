const express = require('express')
const app = express()
const port = 8000
const hbs = require('hbs')
const apiRequest = require('./api-request/index.js')
const path = require('path')
const moment = require('moment');
const yesterday = moment().subtract(1, 'day').format('LL')
const db = require('./db')

const index = require('./routes/index.js')

hbs.registerPartials(__dirname + '/views/partials');


app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use('/', index)

db('tweets').select('*').where('date', yesterday).then( result => {
  if (result.length) {
    console.log('already have yesterdays tweets');
    //do nothing

  } else {
    apiRequest.initializeTwitter()
    apiRequest.fireTwitWatsonProcess()
  }
})

app.use((err, req, res, next) => {
  res.send(err).status(err.status)
})

app.listen(port, () => {
  console.log(`server running on port ${port}`);
})
