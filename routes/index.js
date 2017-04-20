
var express = require('express')
var router = express.Router();
var db = require('../db')


router.get('/', (req,res,next) => {
  console.log('inside of get');
  res.render('index');
})


module.exports = router;
