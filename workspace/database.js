// i want a find user for endpoint  /api/user/me, prob a search for what the findorcreate function returned, but need to do some testing first

// some nod in the functionnames to tell me which functions handle users and which handle content is neccessary if you want to keep everything in one document

//shall we generate a username when user is created?

// added function addcontent


var mongoose = require("mongoose");

var db = mongoose.createConnection("localhost", "soundslike");
var crypt = require("./crypt");
//var schemas = require("./initSchemas");
//schemas.init();


exports.add = add;
exports.findOrCreate = findOrCreate;
exports.getbyname= getbyname;
exports.getbyid = getbyid;
exports.getsoundslike = getsoundslike;
exports.soundslike = soundslike;


var lvl0Schema = new mongoose.Schema({
		name: String,
		rating: Number,
		//picture should end on .png/.jpg and is web address
		picture: String,
		soundslike: [],
		info: {}
	});
var lvl1Schema = new mongoose.Schema({
		name: String,
		rating: Number,
		picture: String,
		soundslike: [],
		parent: Number,
		info: {}
	});
var lvl2Schema = new mongoose.Schema({
		name: String,
		rating: Number,
		picture: String,
		soundslike: [],
		parent: Number,
		info: {}
	});
var userSchema = new mongoose.Schema({
	openID: String
	});

//lvl01Schema.methods.sayName = function(){
//		console.log("This name: "+this.name);};
//var lvl0 = db.model("lvl0",lvl0Schema);
//var lvl1 = db.model("lvl1",lvl1Schema);
//var lvl2 = db.model("lvl2",lvl2Schema);


//This Method finds openId and returns 
//call with
//Callback(err, res)
function findOrCreate(openId, salt, callback){ 
	var saltedid = crypt.hash(openId,salt);
	db.once("open", function(){
		var user = db.model("users",userSchema);
		user.find({openID:saltedid}, function(err, res){
			if (err){
				//console.log(err);
				callback(err, null);
			}
			else if (res[0]){
				//console.log("in callback res "+res);
				callback(err, res[0]._id);

			} else {
				//console.log("in make new user");
				var newUser = new user({openID:saltedid});
				newUser.save(function(errs){
					if (errs) {
						callback("could not make openID", null);
					}
					else {
						console.log("made new user");
						user.find({openID:saltedid}, function(erre, res){
							callback(erre, res[0]._id);
						})
					}
				});
			}
		});
	})
}
//num = what lvl
function getbyname(num, Name, callback){
	if (num==0) {
		var lvl0 = db.model("lvl0",lvl0Schema);
		getbynameHelper(lvl0, Name,function(err, res){
			callback(err,res);});
	}
	else if (num==1) {
		var lvl1 = db.model("lvl1",lvl1Schema);
		getbynameHelper(lvl1, Name,function(err, res){
			callback(err,res);})
	}
	else if (num==2) {
		var lvl2 = db.model("lvl2",lvl2Schema);
		getbynameHelper(lvl2, Name,function(err, res){
			callback(err,res);
})}}
function getbynameHelper(lvl, Name, callback){
	db.once("open", function(){
		lvl.find({name:Name}, function(err, res){
			callback(err, res);
})})}

function getbyid(num, Name, callback){
	if (num==0) {
		var lvl0 = db.model("lvl0",lvl0Schema);
		getbyidHelper(lvl0, Name,function(err, res){
			callback(err,res);});
	}
	else if (num==1) {
		var lvl1 = db.model("lvl1",lvl1Schema);
		getbyidHelper(lvl1, Name,function(err, res){
			callback(err,res);})
	}
	else if (num==2) {
		var lvl2 = db.model("lvl2",lvl2Schema);
		getbyidHelper(lvl2, Name,function(err, res){
			callback(err,res);
})}}
function getbyidHelper(lvl, Name, callback){
	db.once("open", function(){
		lvl.find({_id:Name}, function(err, res){
			callback(err, res);
})})}

function addlvl0(name, rating, picture, soundslike, info, callback){
	db.once("open", function(){
		var lvl0 = db.model("lvl0",lvl0Schema);
		var newlvl0 = new lvl0({
			name: name,
			rating: rating,
			picture: picture,
			soundslike: soundslike,
			info: info
		});
		newlvl0.save(function(err){
			if (err){callback(err);}
			else{callback("success")}
		});
	});
}

function addlvl1(name, rating, picture, soundslike, parent, info, callback){
	db.once("open", function(){
		var lvl1 = db.model("lvl1",lvl1Schema);
		var newlvl1 = new lvl1({
			name: name,
			rating: rating,
			picture: picture,
			soundslike: soundslike,
			parent: parent,
			info: info
		});
		newlvl1.save(function(err){
			if (err){callback(err);}
			else{callback("success")}
		});
	});
}

function addlvl2(name, rating, picture, soundslike, parent, info, callback){
	db.once("open", function(){
		var lvl2 = db.model("lvl2",lvl2Schema);
		var newlvl2 = new lvl2({
			name: name,
			rating: rating,
			picture: picture,
			soundslike: soundslike,
			parent: parent,
			info: info
		});
		newlvl2.save(function(err){
			if (err){callback(err);}
			else{callback("success")}
		});
	});
}

function getsoundslike(soundslikeJSON, callback){
	
	db.once("open", function(){
		console.log(soundslikeJSON);
		var lvl0 = db.model("lvl0",lvl0Schema);
		var array = [];
		var count = 0;
		console.log(soundslikeJSON.length);
		if (soundslikeJSON.length == 0) {
			callback([]);
		}
		if (soundslikeJSON.length == 1) {
			lvl0.find({_id:soundslikeJSON[0]._id}, function(err, res){
				callback(res);
			})
		}
		if (soundslikeJSON.length == 2) {
			lvl0.find({_id:soundslikeJSON[0]._id}, function(err, res){
				lvl0.find({_id:soundslikeJSON[1]._id}, function(err, res1){
					res.push(res1[0]);
					callback(res);
				})
				
			})
		};
		if (soundslikeJSON.length == 3) {
			lvl0.find({_id:soundslikeJSON[0]._id}, function(err, res){
				lvl0.find({_id:soundslikeJSON[1]._id}, function(err, res1){
					res.push(res1[0]);
					lvl0.find({_id:soundslikeJSON[2]._id}, function(err, res2){
						res.push(res2[0]);
						callback(res);
					})
					
				})
				
			})
		};
		if (soundslikeJSON.length == 4) {
			lvl0.find({_id:soundslikeJSON[0]._id}, function(err, res){
				lvl0.find({_id:soundslikeJSON[1]._id}, function(err, res1){
					res.push(res1[0]);
					lvl0.find({_id:soundslikeJSON[2]._id}, function(err, res2){
						res.push(res2[0]);
						
						lvl0.find({_id:soundslikeJSON[3]._id}, function(err, res3){
							res.push(res3[0]);
							callback(res);
						})
					})
					
				})
				
			})
		};
		if (soundslikeJSON.length > 4) {
			lvl0.find({_id:soundslikeJSON[0]._id}, function(err, res){
				lvl0.find({_id:soundslikeJSON[1]._id}, function(err, res1){
					res.push(res1[0]);
					lvl0.find({_id:soundslikeJSON[2]._id}, function(err, res2){
						res.push(res2[0]);
						lvl0.find({_id:soundslikeJSON[3]._id}, function(err, res3){
							res.push(res3[0]);
							lvl0.find({_id:soundslikeJSON[4]._id}, function(err, res4){
								res.push(res4[0]);
								callback(res);
							})
						})
					})
				})	
			})
		};
	});
}

function soundslike(num, id1, id2, callback){
	if (num==0) {
		var lvl0 = db.model("lvl0",lvl0Schema);
		soundslikeHelper(lvl0, id1, id2,function(err, res){
			callback(err,res);});
	}
	else if (num==1) {
		var lvl1 = db.model("lvl1",lvl1Schema);
		soundslikeHelper(lvl1, id1, id2,function(err, res){
			callback(err,res);})
	}
	else if (num==2) {
		var lvl2 = db.model("lvl2",lvl2Schema);
		soundslikeHelper(lvl2, id1, id2,function(err, res){
			callback(err,res);
})}}
function soundslikeHelper(lvl, id1, id2, callback){
	db.once("open", function(){
		lvl.find({_id:id1}, function(err, res1){
			lvl.find({_id:id2}, function(err, res2){
				res1[0].soundslike.push(res2[0]._id);
				lvl.update({_id:id2},{$set: {soundslike: [{_id:res1[0].soundslike[1]}]}}, function(err, res3){
					//console.log(res1[0].soundslike[1]);
					//res2[0].soundslike.push(res1[0]._id);
					
					
					
					
				})
				lvl.update({_id:id1},{$set: {soundslike: [{_id:res2[0].soundslike[1]}]}}, function(err, res4){
						callback("done");
					})
					 
				
			})
			
		})
	})
}

function add(lvl, content, callback){
       switch(lvl){
               case 0:
                       addlvl0(content.name, 0, content.picture, [], "", callback);
               case 1:
                       addlvl1(content.name, 0, content.picture, [], content.parent, "", callback);
               case 2:
                       addlvl2(content.name, 0, content.picture, [], content.parent, "", callback);
               default:
                       callback('invalid level', null);
                       return
       }
       console.log('\ERR: db.add '+ lvl + content + callback);
}