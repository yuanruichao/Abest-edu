var express = require('express');
var passport = require('passport');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

//GET

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/register', function(req, res){
	res.render('register');
});

//POST
router.post('/login', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      	req.logIn(user, function(err) {
      		console.log(user.username + " login success!")
        	res.redirect('/user/' + user.username);
    	});
    } else {
    	if(err) res.render('error', {message: "Login error.", error: err});
      	else res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

router.post('/register', function(req, res) {
	User.register(new User({username:req.body.username, 
                          name: req.body.name,
                          approved: false,
                          isAdmin: false,
                          roles: 0}), 
    	req.body.password, function(err, user){
    	if (err) {
      		console.log(err);
      		res.render('register',{message:'Your username or password is already taken'});
    	}
    	else {
      		passport.authenticate('local')(req, res, function() {
        		res.redirect('/user');
    		});
   		}
  	});   
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
