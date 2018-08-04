var mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
	passportLocalMongoose = require('passport-local-mongoose');

// my schema goes here!

var User = new mongoose.Schema({
	name: String,
	isAdmin: Boolean,
	approved: Boolean,
	roles: Number

});

var stuEvent = new mongoose.Schema({
	// stuid: mongoose.Schema.Types.ObjectId,
	date: Date,
	memo: String
});
var stuInfo = new mongoose.Schema({
	curYear: String,
	curSchool: String,
	// CurSystem: String,
	tel: String,
	parName: String,
	// ParTel: String,
	email: String,
	stuSource: String,
	// EtrTime: Date,
	tarCountry: String,
	tarSchType: String,
	tarSchYear: String,
	// TarSchSeason: String
	division: String,
	aquireDate: Date
});

// var Results = new mongoose.Schema({
// 	SchName: String,
// 	Result: String
// });

var serviceTeam = new mongoose.Schema({
	// AssignDate: Date,
	// Sales: String,
	// Waiji: String,
	// Celue: String,
	// Wenshu: String,
	liuCheng: String
});

var Student = new mongoose.Schema({
	name: String,
	status: String,
	stuInfo: stuInfo,
	
	serviceTeam: serviceTeam,

	stuEvents: [stuEvent],
	historyEvents: [stuEvent],

	memo: String,

	declinedReason: String
	// Status: String,
	// Score: Score,
	// InitEvl: InitEvl,
	// SchList: [School],
	// Results: [Results],
	// Decision: String,
	// Visa: String,
	
});



// var Transcript = new mongoose.Schema({
// 	data: Buffer, 
// 	contentType: String 
// });

// var ToeflScr = new mongoose.Schema({
// 	L: Number,
// 	S: Number,
// 	R: Number,
// 	W: Number
// });


// var SATScr = new mongoose.Schema({
// 	R: Number,
// 	W: Number,
// 	M: Number,
// 	E: Number
// });

// var SAT2Scr = new mongoose.Schema({
// 	Subject: String,
// 	Score: Number
// });

// var APScr = new mongoose.Schema({
// 	Subject: String,
// 	Score: Number
// });

// var Score = new mongoose.Schema({
// 	Transcript: Transcript,
// 	ToeflScrs: [ToeflScr],
// 	IELTSScrs: Number,
// 	SATScrs: [SATScr],
// 	SAT2Scrs: [SAT2Scr],
// 	APScrs: [APScr],

// });

// var InitEvl = new mongoose.Schema({
// 	StuQues: {data: Buffer, contentType: String},
// 	ParQues: {data: Buffer, contentType: String},
// 	PostRep: {data: Buffer, contentType: String},
// 	DeepSkype: Date
// });

// var School = new mongoose.Schema({
// 	Date: Date,
// 	Schools: [String]
// });



User.plugin(passportLocalMongoose);
Student.plugin(URLSlugs('_id'));

mongoose.model('User', User);
mongoose.model('stuInfo', stuInfo);
mongoose.model('serviceTeam', serviceTeam);
mongoose.model('stuEvent', stuEvent);
// mongoose.model('Transcript', Transcript);
// mongoose.model('ToeflScr', ToeflScr);
// //mongoose.model('IELTSScr', IELTSScr);
// mongoose.model('SATScr', SATScr);
// mongoose.model('SAT2Scr', SAT2Scr);
// mongoose.model('APScr', APScr);
// mongoose.model('Score', Score);
// mongoose.model('InitEvl', InitEvl);
// mongoose.model('School', School);
// mongoose.model('Results', Results);
mongoose.model('Student', Student);



var url = "mongodb://user:"+ process.env.dbpassword +"@ds037244.mongolab.com:37244/abestapi";
mongoose.connect(url);
// mongo ds037244.mlab.com:37244/abestapi -u user -p <dbpassword>
// mongoose.connect('mongodb://localhost/abest');





