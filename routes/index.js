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
	Student.find(function(err, stu, count){
		res.render('sales', { obj: stu });
	});
});

router.get('/payment', function(req, res, next) {
	Student.find(function(err, stu, count){
		res.render('payment', { obj: stu });
	});
});

router.get('/allstudents', function(req, res, next) {
	Student.find(function(err, stu, count){
		res.render('allstudents', { obj: stu });
	});
});

router.get('/stu/:slug', function(req, res, next) {
	var slug = req.params.slug;
	console.log(slug);
	Student.findOne({slug : slug}, function(err, stu, count) {
		if (stu == null) {
			console.log("not found stu");
			res.render('error', {message: "Student not found"});
		}
		else res.render('stuprofile', {obj: stu, slug: slug, user: req.user});	
  	});
});

module.exports = router;
