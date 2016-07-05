var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Student = mongoose.model('Student');

var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport")
//var smtpConfig = require('../config/smtpConfig.js').smtpConfig;
var smtpConfig = process.env.smtpConfig;

router.post('/sales', function(req, res, next) {
	console.log('within post /sales');

	var transporter = nodemailer.createTransport(smtpTransport(smtpConfig));

	var email_subject  = req.body.name + " pending " + req.body.amount;
	var email_body = req.body.name + " pending " + req.body.amount;
	var mailData = {
	    from: 'alert@abest-edu.com',
	    to: 'alert@abest-edu.com',
	    subject: email_subject,
	    text: email_body,
	};

	transporter.sendMail(mailData, function(err, info){
		console.log("err = ", err);
		console.log("info = ", info);
	});

	Student.findOne({name: req.body.name}, function(err, stu) {
		console.log("stu = ", stu);
		if(stu == null){
			var s = new Student({
				name: req.body.name,
				amount: -req.body.amount,
				status: "pending"
			});
			s.save(function(err, stu, count) {
    			res.redirect('/');
  			});
		}
		else{
			var tmpa = parseInt(stu.amount);
			Student.update({name: req.body.name}, {
													amount: tmpa - parseInt(req.body.amount),
													status: "Waiting " + (- tmpa + parseInt(req.body.amount))},
												function(err){
													res.redirect('/');
												});
		}
	});
});


router.post('/payment', function(req, res, next) {
	console.log('within post /payment');
	
	var transporter = nodemailer.createTransport(smtpConfig);

	var email_subject  = req.body.name + " received " + req.body.amount;
	var email_body = req.body.name + " received " + req.body.amount;
	var mailData = {
	    from: 'alert@abest-edu.com',
	    to: 'alert@abest-edu.com',
	    subject: email_subject,
	    text: email_body,
	};

	transporter.sendMail(mailData, function(err, info){
		console.log("err = ", err);
		console.log("info = ", info);
	});

	Student.findOne({name: req.body.name}, function(err, stu) {
		console.log(stu);
		var tmpa = parseInt(stu.amount); 
		var aleft = tmpa + parseInt(req.body.amount);
		if(aleft == 0){
			Student.update({name: req.body.name}, {
													amount: 0,
													status: "Need Follow Up"
												},
												function(err){
													res.redirect('/');
												});
		}else{
			Student.update({name: req.body.name}, {
													amount: aleft,
													status: "Waiting " + aleft.toString()
												},
												function(err){
													res.redirect('/');
												});
		}
    	
  	});
	
	
});

module.exports = router;

