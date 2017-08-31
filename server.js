const express = require('express')
const app = express()
const port = 8000
const hbs = require('hbs')
const apiRequest = require('./api-request.js')
const path = require('path')

const index = require('./routes/index.js')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use('/', index)

apiRequest.initializeTwitter()
apiRequest.fireTweetrequest

app.use((err, req, res, next) => {
  res.send(err).status(err.status)
})

app.listen(port, () => {
  console.log(`server running on port ${port}`);
})
