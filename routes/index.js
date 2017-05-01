
var express = require('express')
var router = express.Router();
var db = require('../db')


router.get('/', (req,res,next) => {
  db('tweets').select('*').then( tweets => {
    db('btc_prices').select('*').then( btc_prices => {
      res.render('index', {tweets, btc_prices});
    })
  }).catch( error => {
  console.log(error);
  })
})


module.exports = router;
