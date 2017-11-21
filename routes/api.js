var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var StuInfo = mongoose.model('StuInfo');
var ServiceTeam = mongoose.model('ServiceTeam');
var Transcript = mongoose.model('Transcript');
var ToeflScr = mongoose.model('ToeflScr');
var SATScr = mongoose.model('SATScr');
var SAT2Scr = mongoose.model('SAT2Scr');
var APScr = mongoose.model('APScr');
var Score = mongoose.model('Score');
var InitEvl = mongoose.model('InitEvl');
var School = mongoose.model('School');
var Results = mongoose.model('Results');
var Student = mongoose.model('Student');

var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport")
//var smtpConfig = require('../config/smtpConfig.js').smtpConfig;
var smtpConfig = process.env.smtpConfig;

router.post('/newstu', function(req, res, next) {
	console.log("within post /newstu");
	// console.log("body = ", req.body);

	console.log("test0");
	var s = new Student({
		Name : req.body.Name,
		Cancel: ""
	});
	console.log("test1", s);
	s.save(function(err, stu, count) {
		console.log("test2");
    	// if(err) res.render("error", {message : "Save Error", error : err});
    	// else 
    	changestatus(req, res, s.slug);
  	});
});

router.post('/StuInfo', function(req, res, next) {
	console.log("within post /StuInfo");
	
	var si = new StuInfo({
		CurYear : req.body.CurYear,
		CurSchool : req.body.CurSchool,
		CurSystem : req.body.CurSystem,
		Tel : req.body.Tel,
		ParName : req.body.ParName,
		ParTel : req.body.ParTel,
		Email : req.body.Email,
		StuSource : req.body.StuSource,
		EtrTime : req.body.EtrTime,
		TarCountry : req.body.TarCountry,
		TarSchType : req.body.TarSchType,
		TarSchYear : req.body.TarSchYear,
		TarSchSeason : req.body.TarSchSeason
	});

	Student.update({slug : req.body.slug}, {StuInfo: si}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		changestatus(req, res, req.body.slug);
		}
	});

});
router.post('/ServiceTeam', function(req, res, next) {
	console.log("within post /ServiceTeam");
	
	var si = new ServiceTeam({
		AssignDate : req.body.AssignDate,
		Sales : req.body.Sales,
		Waiji : req.body.Waiji,
		Celue : req.body.Celue,
		Wenshu : req.body.Wenshu,
		Liucheng : req.body.Liucheng,
	});

	Student.update({slug : req.body.slug}, {ServiceTeam: si}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		changestatus(req, res, req.body.slug);
		}
	});

});
router.post('/Score', function(req, res, next) {
	console.log("within post /Score");
	
	var si = new Score({
		Transcript : req.body.Transcript,
		ToeflScrs : req.body.ToeflScrs,
		IELTSScrs : req.body.IELTSScrs,
		SATScrs : req.body.SATScrs,
		SAT2Scrs : req.body.SAT2Scrs,
		APScrs : req.body.APScrs,
	});

	Student.update({slug : req.body.slug}, {Score: si}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		changestatus(req, res, req.body.slug);
		}
	});

});
router.post('/InitEvl', function(req, res, next) {
	console.log("within post /InitEvl");
	
	var si = new InitEvl({
		StuQues : req.body.StuQues,
		ParQues : req.body.ParQues,
		PostRep : req.body.PostRep,
		DeepSkype : req.body.DeepSkype,
	});

	Student.update({slug : req.body.slug}, {InitEvl: si}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		changestatus(req, res, req.body.slug);
		}
	});

});
router.post('/SchList', function(req, res, next) {
	console.log("within post /SchList");
	
	var sch = new School({
		Date: req.body.Date,
		Schools: req.body.Schools
	});

	var si = new Results({
		SchName : req.body.Schools,
		Result : "Pending",
	});

	Student.update({slug : req.body.slug}, {SchList: sch, Results: si}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		changestatus(req, res, req.body.slug);
		}
	});

});

router.post('/Result', function(req, res, next) {
	console.log("within post /Result");
	
	var si = new Results({
		SchName : req.body.SchName,
		Result : req.body.Result,
	});

	Student.update({slug : req.body.slug}, {Results: si}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		changestatus(req, res, req.body.slug);
		}
	});

});
router.post('/Decision', function(req, res, next) {
	console.log("within post /Decision");

	Student.update({slug : req.body.slug}, {Decision: req.body.Decision,}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		changestatus(req, res, req.body.slug);
		}
	});

});
router.post('/Visa', function(req, res, next) {
	console.log("within post /Visa");
	
	Student.update({slug : req.body.slug}, {Visa: req.body.Visa,}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		changestatus(req, res, req.body.slug);
		}
	});

});
router.post('/Decline', function(req, res, next) {
	console.log("within post /Decline");

	Student.update({slug : req.body.slug}, {DeclineReason: req.body.DeclineReason}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		changestatus(req, res, req.body.slug);
		}
	});

});

var changestatus = function(req, res, slug){
	Student.findOne({slug: slug}, function(err, stu){
		if(err) res.render("error", {message: "changestatus error", error: err});
		else{
			if(stu.DeclineReason != "") Student.update({slug: slug},{Status: "Declined"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
			else if(stu.StuInfo == null) Student.update({slug: slug},{Status: "StuInfo"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
			else if(stu.ServiceTeam == null) Student.update({slug: slug},{Status: "ServiceTeam"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
			else if(stu.Score == null) Student.update({slug: slug},{Status: "Score"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
			else if(stu.InitEvl == null) Student.update({slug: slug},{Status: "InitEvl"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
			else if(stu.SchList == "") Student.update({slug: slug},{Status: "SchList"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
			else if(stu.Results == null) Student.update({slug: slug},{Status: "Result"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
			else if(stu.Decision == "") Student.update({slug: slug},{Status: "Decision"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
			else if(stu.Visa == "") Student.update({slug: slug},{Status: "Visa"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
			else Student.update({slug: slug},{Status: "Done"},function(err){
				if(err) res.render("error", {message : "Update Error", error : err});
				else res.redirect(303, '/stu/' + slug);
			});
		}
	})
	
}






router.post('/sales', function(req, res, next) {
	console.log('within post /sales');
	console.log(smtpConfig);
	var transporter = nodemailer.createTransport(smtpConfig);

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
				Name: req.body.name,
				Amount: -req.body.amount,
				Status: "pending"
			});
			s.save(function(err, stu, count) {
    			res.redirect('/');
  			});
		}
		else{
			var tmpa = parseInt(stu.amount);
			Student.update({Name: req.body.name}, {
													Amount: tmpa - parseInt(req.body.amount),
													Status: "Waiting " + (- tmpa + parseInt(req.body.amount))},
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
													Amount: 0,
													Status: "Need Follow Up"
												},
												function(err){
													res.redirect('/');
												});
		}else{
			Student.update({name: req.body.name}, {
													Amount: aleft,
													Status: "Waiting " + aleft.toString()
												},
												function(err){
													res.redirect('/');
												});
		}
    	
  	});
	
	
});

module.exports = router;






