var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Student = mongoose.model('Student');


/* GET home page. */

router.post('/sales', function(req, res, next) {
	console.log('within post /sales');
	Student.findOne({name: req.body.name}, function(err, stu) {
		console.log(stu);
		if(stu == null){
			var s = new Student({
				name: req.body.name,
				amount: req.body.amount
			});
			s.save(function(err, stu, count) {
    			res.redirect('/');
  			});
		}
		else{
			var tmpa = parseInt(stu.amount); 
			Student.update({name: req.body.name}, {name: req.body.name,
												amount: tmpa + parseInt(req.body.amount)},
												function(err){
													res.redirect('/');
												});
		}
	});
});


router.post('/payment', function(req, res, next) {
	console.log('within post /payment');
	
	Student.findOne({name: req.body.name}, function(err, stu) {
		console.log(stu);
		var tmpa = parseInt(stu.amount); 
		Student.update({name: req.body.name}, {name: req.body.name,
												amount: tmpa - parseInt(req.body.amount)},
												function(err){
													res.redirect('/');
												});
    	
  	});
	
	
});

module.exports = router;

