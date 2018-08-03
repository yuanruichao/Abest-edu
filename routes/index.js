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

router.get('/user/:slug', function(req, res, next) {
	var slug = req.params.slug;
	if(slug != res.locals.user.username && !res.locals.user.isAdmin){
		res.render('error', {message: "DO NOT STALK YOUR FRIEND"})
	}
	else{
		User.findOne({username: slug}, function(err, user, count){
			Student.find({"serviceTeam.liuCheng" : user.username}, function(err, stu, count){
				res.render('user', {stu: stu, user: user});
			});
		});
	}
	
});

router.get('/admin', function(req, res, next) {
	if(!res.locals.user.isAdmin){
		res.render('error', {message: "Page Not Found"})
	}
	else{
	User.find(function(err, user, count){
		waitApprove = user.filter(function(e){
			if(!e.approved) return true;
			return false;
		})
		Approved = user.filter(function(e){
			if(!e.approved) return false;
			return true;
		})
		console.log(res.locals.user)
		res.render('admin', {user: res.locals.user, allusers: Approved, waitApprove: waitApprove});
	});
	}
	
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
