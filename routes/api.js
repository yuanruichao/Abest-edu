var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var StuInfo = mongoose.model('stuInfo');
var ServiceTeam = mongoose.model('serviceTeam');
var stuEvent = mongoose.model('stuEvent');
// var Transcript = mongoose.model('Transcript');
// var ToeflScr = mongoose.model('ToeflScr');
// var SATScr = mongoose.model('SATScr');
// var SAT2Scr = mongoose.model('SAT2Scr');
// var APScr = mongoose.model('APScr');
// var Score = mongoose.model('Score');
// var InitEvl = mongoose.model('InitEvl');
// var School = mongoose.model('School');
// var Results = mongoose.model('Results');
var Student = mongoose.model('Student');

var fs = require('fs');
var path = require('path')

var XLSX = require('xlsx');

var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport")
//var smtpConfig = require('../config/smtpConfig.js').smtpConfig;
var smtpConfig = process.env.smtpConfig;

router.post('/newstu', function(req, res, next) {
	console.log("within post /newstu");
	// console.log("body = ", req.body);

	var si = new StuInfo({
		curYear : req.body.curYear,
		curSchool : req.body.curSchool,
		tel : req.body.tel,
		parName : req.body.parName,
		email : req.body.email,
		division: req.body.division,
		stuSource : req.body.stuSource,
		aquireDate : req.body.aquireDate,
		tarSchType : req.body.tarSchType,
		tarSchYear : req.body.tarSchYear,
	});
	var s = new Student({
		Name : req.body.Name,
		stuInfo: si,
		status: "unassigned"
	});

	console.log(res.user.username, "added new Stu:\n", s);
	s.save(function(err, stu, count) {
		
    	if(err) res.render("error", {message : "Save Error", error : err});
    	else 
    	// changestatus(req, res, s.slug);
    		res.redirect('/allstudents');
  	});
});


router.post('/assignstu', function(req, res, next) {
	console.log("within post /assignstu");
	// console.log(req.body);
	if(!res.user.isAdmin){
		res.render('error', {message: "Page Not Found"})
	}
	else{
		var toUpdate = req.body.stuid.split(',');
		var liuCheng = req.body.liucheng;

		Student.update({_id: {$in: toUpdate}}, {$set:{"serviceTeam.liuCheng":liuCheng, status: "assigned"}}, {"multi": true}, function(err) {
			if(err)
    			res.render("error", {message : "Update Error", error : err});
    		else {
    			console.log(res.user.username + " assigned " + req.body.stuid + " to " + liuCheng);
    			res.redirect('/allstudents');
			}
		});
	}
});

router.post('/deletestu', function(req, res, next) {
	console.log("within post /assignstu");
	// console.log(req.body);
	if(!res.user.isAdmin){
		res.render('error', {message: "Page Not Found"})
	}
	else{
		var toUpdate = req.body.stuid.split(',');
		var liuCheng = req.body.liucheng;

		Student.deleteMany({_id: {$in: toUpdate}}, function(err) {
			if(err)
    			res.render("error", {message : "Update Error", error : err});
    		else {
    			console.log(res.user.username + " assigned " + req.body.stuid + " to " + liuCheng);
    			res.redirect('/allstudents');
			}
		});
	}
});

router.post('/addevent', function(req, res, next) {
	console.log("within post /addevent");
	// console.log(req.body);

	var stuid = req.body.stuid;
	var memo = req.body.memo;
	var date = req.body.date;
	var toAdd = new stuEvent({
		// stuid: stuid,
		date: date,
		memo: memo
	})
	// console.log(stuid)
	// console.log("findOneAndUpdate({_id:"+stuid+"}, {$set:{\"events\":toAdd}}")
	Student.findOneAndUpdate({_id:stuid}, {$push:{"stuEvents":toAdd}}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		console.log(res.user.username + " add " + date + ", " + memo + " to " + stuid);
    		res.redirect('/allstudents');
		}
	});
});


router.get('/getevents/:slug', function(req, res, next) {
	console.log("within get /getevents");
	// console.log(req.body);
	var slug = req.params.slug;

	Student.find({"serviceTeam.liuCheng": slug}, function(err, stu, count){
		if(err) console.log(err)
		else{
			// console.log(stu);
			var arr = []
			stu.forEach(function(e){
				// console.log("id = " + stu._id)
				e.stuEvents.forEach(function(ee){
					//TODO ee does not work!
					var tmp = {}
					tmp._id = ee._id
					tmp.date = ee.date;
					tmp.memo = ee.memo;
					tmp.stuId = e._id;
					tmp.stuName = e.name;
					arr.push(tmp);
				})
			})
			// console.log(arr);
			arr.sort(function(a, b){return a.date - b.date});
			res.send(arr);
		}
	});
});

router.post('/completeevent', function(req, res, next) {
	console.log("within post /completeevent");

	var stuId = req.body.stuId;
	// console.log(stuId);
	var id = req.body.id;
	// console.log(id);
	// console.log(req.body);
	Student.findOne({"_id": stuId}, function(err, stu, count){
		// console.log(stu);
		stueve = stu.stuEvents.filter(function(e){return e._id == id});
		// console.log(stueve)
		Student.findOneAndUpdate({_id:stuId}, {$push:{"historyEvents":stueve[0]}}, function(err){
			Student.update({"_id": stuId}, {$pull:{stuEvents:{"_id": id}}}, function(err){
				if(err)
    				res.render("error", {message : "Update Error", error : err});
    			else {
    				console.log(res.user.username + " complete event " + req.body.stuId + " eventId: " + id);
    				res.redirect('/user');
				}
			});
		})
	})
});


router.post('/uploadxlsx', function(req, res, next) {
	console.log("within post /uploadxlsx");
	// console.log(req.files)
	// console.log(__dirname);
	var fName = req.files.file.name + "_"
	var savePath = __dirname.substring(0, __dirname.lastIndexOf(path.sep))
	savePath = path.join(savePath, 'uploadFiles', fName)
	// console.log(savePath)

	req.files.file.mv(savePath, function(err) {
    	if (err) return res.status(500).send(err);
		Student.find(function(err, stu, count){
			stuNames = []
			stuTels = []
			stu.forEach(function(e){
				stuNames.push(e.name)
				stuTels.push(e.stuInfo.tel);
			})
			var workbook = XLSX.readFile(savePath);
			doc = []
			duplicates = []
			for(var i = 0; i < workbook.SheetNames.length; i++){
				// if(i > 0) break;
				var sname = workbook.SheetNames[i]
				var sheet = workbook.Sheets[sname]
				var alpha = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
				var colName = 'Z'
				var colTarSchYear = 'Z'
				var colCurSchool = 'Z'
				var colParName = 'Z'
				var colTel = 'Z'
				var colEmail = 'Z'
				var colStuSource = 'Z'
				var colMemo = 'Z'
				for(var k = 0; k < 11; k++){
					if(sheet[alpha[k] + '2'] && sheet[alpha[k] + '2'].v == "学生姓名") colName = alpha[k];
					if(sheet[alpha[k] + '2'] && sheet[alpha[k] + '2'].v == "申请界别") colTarSchYear = alpha[k];
					if(sheet[alpha[k] + '2'] && sheet[alpha[k] + '2'].v == "所在学校") colCurSchool = alpha[k];
					if(sheet[alpha[k] + '2'] && sheet[alpha[k] + '2'].v == "家长姓名") colParName = alpha[k];
					if(sheet[alpha[k] + '2'] && sheet[alpha[k] + '2'].v == "手机号码") colTel = alpha[k];
					if(sheet[alpha[k] + '2'] && sheet[alpha[k] + '2'].v == "邮箱/微信") colEmail = alpha[k];
					if(sheet[alpha[k] + '2'] && sheet[alpha[k] + '2'].v == "来源") colStuSource = alpha[k];
					if(sheet[alpha[k] + '2'] && sheet[alpha[k] + '2'].v == "备注") colMemo = alpha[k];
				}
				var row = 3
				while(sheet['A' + row]){
					cur = {}
					
					var colCurSchool
					var si  = {
						curSchool : (sheet[colCurSchool + row] ? sheet[colCurSchool + row].v : ""),
						tel : (sheet[colTel + row] ? sheet[colTel + row].v : ""),
						parName : (sheet[colParName + row] ? sheet[colParName + row].v : ""),
						email : (sheet[colEmail + row] ? sheet[colEmail + row].v : ""),
						division: "上海",
						tarSchYear : (sheet[colTarSchYear + row] ? sheet[colTarSchYear + row].v : ""),
						stuSource : (sheet[colStuSource + row] ? sheet[colStuSource + row].v : "")
					}
					var cur = {
						name : (sheet[colName + row] ? sheet[colName + row].v : ""),
						stuInfo: si,
						memo: (sheet[colMemo + row] ? sheet[colMemo + row].v : ""),
						uploadedBy: res.user.username,
						status: "unassigned"
					}
					if(sheet[colName + row] && stuNames.includes(sheet[colName + row].v)|| 
						sheet[colTel + row] && stuTels.includes(sheet[colTel + row].v)){
						duplicates.push(cur);
					}
					else{
						stuNames.push(sheet[colName + row] ? sheet[colName + row].v : "")
						stuTels.push(sheet[colTel + row] ? sheet[colTel + row].v : "")
						doc.push(cur);
					}
					row = row + 1;
					
				}
			}
			Student.create(doc, function (err, docs) {
      			if (err){ 
          			console.error(err);
          			res.send(err);
      			} else {
      				console.log(res.user.username + " uploaded " + doc.length + " students");
        			res.send(duplicates)
      			}
    		});
    		fs.unlinkSync(savePath);
			
		});
  	});
});

router.get('/getstuinfo/', function(req, res, next) {
	console.log("within get /getstuinfo");
	var query = req.query;
	var name = req.query.name
	var tel = req.query.tel
	// console.log(query);

	Student.findOne({$or:[ {'name':name}, {'stuInfo.tel':tel}]}, function(err, stu, count) {
		if (err){
			console.log(err);
		}
		if (stu == null) {
			console.log("not found stu");
			res.send('error')
		}
		else{
			// console.log(stu)
			res.send(stu)
		}
  	});

});

router.post('/addstu', function(req, res, next) {
	console.log("within post /addstu");
	var stu = req.body.stu
	stu.forEach(function(e){
		var si  = {
			curSchool : e.curSchool,
			tel : e.tel,
			parName : e.parName,
			email : e.email,
			division: e.division,
			tarSchYear : e.tarSchYear,
			stuSource : e.stuSource
		}
		var st = {
			liuCheng: e.liuCheng
		}
		var cur = {
			name : e.name,
			stuInfo: si,
			serviceTeam: st,
			uploadedBy: res.user.username,
			status: "unassigned"
		}
		doc.push(cur);		
	});
	Student.create(doc, function (err, docs) {
   		if (err){ 
      		console.error(err);
      		res.send(err);
   		} else {
   			console.log(res.user.username + " created one student");
    		res.send('success')
   		}
	});

});


router.post('/StuInfo', function(req, res, next) {
	console.log("within post /StuInfo");
	
	var si = new StuInfo({
		curYear : req.body.curYear,
		curSchool : req.body.curSchool,
		tel : req.body.tel,
		parName : req.body.parName,
		email : req.body.email,
		stuSource : req.body.stuSource,
		tarCountry : req.body.tarCountry,
		tarSchType : req.body.tarSchType,
		tarSchYear : req.body.tarSchYear,
		division : req.body.division,
		aquireDate : req.body.aquireDate,
	});

	Student.update({slug : req.body.slug}, {StuInfo: si}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		console.log(res.user.username + " updated student " + req.body.slug);
    		res.redirect(303, '/stu/' + req.body.slug);
		}
	});

});

router.post('/setmemo', function(req, res, next) {
	console.log("within post /setmemo");
	// console.log(req.body);
	Student.update({slug : req.body.slug}, {memo: req.body.stumemo}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		console.log(res.user.username + " set memo " + req.body.slug + ": " + req.body.stumemo);
    		res.redirect(303, '/stu/' + req.body.slug);
		}
	});

});

router.post('/bound', function(req, res, next) {
	console.log("within post /setmemo");
	// console.log(req.body);
	Student.update({slug : req.body.slug}, {status: "bounded"}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		console.log(res.user.username + " set " + req.body.slug + "to bounded");
    		res.redirect(303, '/stu/' + req.body.slug);
		}
	});
});

router.post('/decline', function(req, res, next) {
	console.log("within post /decline");
	// console.log(req.body);
	Student.update({slug : req.body.slug}, {status: "declined", declinedReason: req.body.declinedReason}, function(err) {
		if(err)
    		res.render("error", {message : "Update Error", error : err});
    	else {
    		console.log(res.user.username + " set " + req.body.slug + "to decline");
    		res.redirect(303, '/stu/' + req.body.slug);
		}
	});
});

router.post('/approveuser', function(req, res, next) {
	console.log("within post /approveuser");
	// console.log(req.body);
	User.update({username : req.body.username}, {approved: true}, function(err) {
		if(err)
    		res.render(err, {message: 'err', error: err})
    	else {
    		console.log(res.user.username + " approved " + req.body.username);
    		res.redirect('/admin')
		}
	});
});

router.get('/getapprovedusers', function(req, res, next) {
	console.log("within get /getapprovedusers");
	// console.log(req.body);
	User.find(function(err, user, count){
		Approved = user.filter(function(e){
			if(!e.approved) return false;
			return true;
		})
		res.send(Approved);
	});
});

router.post('/modifyisadmin', function(req, res, next) {
	console.log("within post /modifyisAdmin");
	// console.log(req.body);
	User.update({username : req.body.pk}, {isAdmin: req.body.value}, function(err) {
		if(err)
    		res.send('failed')
    	else {	
    		console.log(res.user.username + " set " + req.body.pk + "admin to " + req.body.value);
    		res.send('success')
		}
	});
	
});


module.exports = router;



