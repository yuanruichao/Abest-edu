var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Student = mongoose.model('Student');
/* GET home page. */

router.get('/', function(req, res, next) {
	Student.find(function(err, stu, count){
		res.render('index', { obj: stu });
	});
});

router.get('/sales', function(req, res, next) {
  res.render('sales');
});

router.get('/payment', function(req, res, next) {
  res.render('payment');
});

module.exports = router;
