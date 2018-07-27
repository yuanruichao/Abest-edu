var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Student = mongoose.model('Student');
var User = mongoose.model('User');
/* GET home page. */

router.get('/', function(req, res, next) {
	Student.find(function(err, stu, count){
		res.render('index', { obj: stu });
	});
});

router.get('/user', function(req, res, next) {
	Student.find({"serviceTeam.liuCheng" : res.locals.user.username}, function(err, stu, count){
		res.render('user', {stu: stu, user: res.locals.user});
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
		User.find(function(err, user, count){
			res.render('allstudents', {obj: stu, user: res.locals.user, allusers: user});
		});
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
		else {
			User.find(function(err, user, count){
				res.render('stuprofile', {obj: stu, slug: slug, user: req.user, allusers: user});
			});
		}
  	});
});

router.get('/uploadxlsx', function(req, res, next) {
	res.render('uploadxlsx');

});

module.exports = router;
