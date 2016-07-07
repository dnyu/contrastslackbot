//Dependencies
var express = require('express');
var parser = require('body-parser');
var router = express.Router();	

//Routes
router.get('/', function(req, res, next) {
  res.render('example', { title: 'nodenow' });
});



//Export
module.exports = router;
