var mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
	passportLocalMongoose = require('passport-local-mongoose');

// my schema goes here!



var Student = new mongoose.Schema({
	name: String,
	amount: Number
});

var User = new mongoose.Schema({
	lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

Student.plugin(URLSlugs('name'));

User.plugin(passportLocalMongoose);
mongoose.model('Student', Student);

var uri = "mongodb://username:password@ds037244.mongolab.com:37244/abestapi";
mongoose.connect(uri);
//mongoose.connect('mongodb://localhost/test');