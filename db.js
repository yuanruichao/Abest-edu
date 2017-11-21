var mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
	passportLocalMongoose = require('passport-local-mongoose');

// my schema goes here!

var User = new mongoose.Schema({
	Name: String,
	Acess: [String]
});

var StuInfo = new mongoose.Schema({
	CurYear: String,
	CurSchool: String,
	CurSystem: String,
	Tel: String,
	ParName: String,
	ParTel: String,
	Email: String,
	StuSource: String,
	EtrTime: Date,
	TarCountry: String,
	TarSchType: String,
	TarSchYear: String,
	TarSchSeason: String
});

var ServiceTeam = new mongoose.Schema({
	AssignDate: Date,
	Sales: String,
	Waiji: String,
	Celue: String,
	Wenshu: String,
	Liucheng: String
});

var Transcript = new mongoose.Schema({
	data: Buffer, 
	contentType: String 
});

var ToeflScr = new mongoose.Schema({
	L: Number,
	S: Number,
	R: Number,
	W: Number
});


var SATScr = new mongoose.Schema({
	R: Number,
	W: Number,
	M: Number,
	E: Number
});

var SAT2Scr = new mongoose.Schema({
	Subject: String,
	Score: Number
});

var APScr = new mongoose.Schema({
	Subject: String,
	Score: Number
});

var Score = new mongoose.Schema({
	Transcript: Transcript,
	ToeflScrs: [ToeflScr],
	IELTSScrs: Number,
	SATScrs: [SATScr],
	SAT2Scrs: [SAT2Scr],
	APScrs: [APScr],

});

var InitEvl = new mongoose.Schema({
	StuQues: {data: Buffer, contentType: String},
	ParQues: {data: Buffer, contentType: String},
	PostRep: {data: Buffer, contentType: String},
	DeepSkype: Date
});

var School = new mongoose.Schema({
	Date: Date,
	Schools: [String]
});

var Results = new mongoose.Schema({
	SchName: String,
	Result: String
});

var Student = new mongoose.Schema({
	Name: String,
	Status: String,
	StuInfo: StuInfo,
	ServiceTeam: ServiceTeam,
	Score: Score,
	InitEvl: InitEvl,
	SchList: [School],
	Results: [Results],
	Decision: String,
	Visa: String,
	DeclinedReason: String
});

User.plugin(passportLocalMongoose);
Student.plugin(URLSlugs('Name'));

mongoose.model('User', User);
mongoose.model('StuInfo', StuInfo);
mongoose.model('ServiceTeam', ServiceTeam);
mongoose.model('Transcript', Transcript);
mongoose.model('ToeflScr', ToeflScr);
//mongoose.model('IELTSScr', IELTSScr);
mongoose.model('SATScr', SATScr);
mongoose.model('SAT2Scr', SAT2Scr);
mongoose.model('APScr', APScr);
mongoose.model('Score', Score);
mongoose.model('InitEvl', InitEvl);
mongoose.model('School', School);
mongoose.model('Results', Results);
mongoose.model('Student', Student);



//var url = "mongodb://username:password@ds037244.mongolab.com:37244/abestapi";
//mongoose.connect(url);
mongoose.connect('mongodb://localhost/test');





