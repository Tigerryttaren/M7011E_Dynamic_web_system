// i want a find user for endpoint  /api/user/me, prob a search for what the findorcreate function returned, but need to do some testing first

// some nod in the functionnames to tell me which functions handle users and which handle content is neccessary if you want to keep everything in one document

//shall we generate a username when user is created?

// added function addcontent


var mongoose = require("mongoose");

var db = mongoose.createConnection("localhost", "soundslike");
var crypt = require("./crypt");
//var schemas = require("./initSchemas");
//schemas.init();
exports.getlvl0 = getlvl0;
exports.addlvl0 = addlvl0;
exports.getlvl1 = getlvl1;
exports.addlvl1 = addlvl1;
exports.getlvl2 = getlvl2;
exports.addlvl2 = addlvl2;
exports.findOrCreate = findOrCreate;
exports.getbyname= getbyname;
exports.getany=getany;

var lvl0Schema = new mongoose.Schema({
		name: String,
		rating: Number,
		//picture should end on .png/.jpg and is web address
		picture: String,
		soundslike: {},
		info: {}
	});
var lvl1Schema = new mongoose.Schema({
		name: String,
		rating: Number,
		picture: String,
		soundslike: {},
		parent: Number,
		info: {}
	});
var lvl2Schema = new mongoose.Schema({
		name: String,
		rating: Number,
		picture: String,
		soundslike: {},
		parent: Number,
		info: {}
	});
var userSchema = new mongoose.Schema({
	openID: String
	});

//lvl01Schema.methods.sayName = function(){
//		console.log("This name: "+this.name);};



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

function getany(num, what, ID, callback){
if (num==0) {
		var lvl0 = db.model("lvl0",lvl0Schema);
		getbyidHelper(lvl0, what, ID,function(err, res){
			callback(err,res);
		});
	}
}
function getbyidHelper(lvl, what, Name, callback){
	db.once("open", function(){
		lvl.find({what:Name}, function(err, res){
			callback(err, res);
})})}





function addcontent(lvl, parent, content, callback){
	switch(lvl){
		case 0:
			addlvl0(content, callback);
		case 1:
			addlvl1(parent, content, callback);
		case 2:
			addlvl2(parent, content, callback);
		default:
			callback('invalid level', null);
	}
}

function getlvl0(artistName, callback){
	db.once("open", function(){
		var lvl0 = db.model("lvl0",lvl0Schema);
		lvl0.find({name:artistName}, function(err, res){
			callback(err, res);
		})
	});
}

function addlvl0(artistName, arg2, callback){
	db.once("open", function(){
		var lvl0 = db.model("lvl0",lvl0Schema);
		var newlvl0 = new lvl0({name:artistName, info:arg2 });
		newlvl0.save(function(err){
			if (err){callback(err);}
			else{callback(null)}
		});
	});
}



function getlvl1(albumName, callback){
	db.once("open", function(){
		var lvl1 = db.model("lvl1",albumSchema);
		lvl1.find({name:albumName}, function(err, res){
			callback(err, res);
		})
	});
}
function addlvl1(albumName, callback){
	db.once("open", function(){
		var lvl1 = db.model("lvl1",lvl1Schema);
		var metallica = new lvl1({name:"Niklas"}, {info:["Niklas", "hej"]});
		metallica.save(function(err){
			if (err){callback(err);}
			else{callback(null)}
		});
		
	});
}

function getlvl2(trackName, callback){
	db.once("open", function(){
		var lvl2 = db.model("lvl2",trackSchema);
		lvl2.find({name:trackName}, function(err, res){
			callback(err, res);
		})
	});
}
function addlvl2(trackName, callback){
	db.once("open", function(){
		var lvl2 = db.model("lvl2",lvl2Schema);
		var metallica = new lvl2({name:"Niklas"}, {info:["Niklas", "hej"]});
		metallica.save(function(err){
			if (err){callback(err);}
			else{callback(null)}
		});
		
	});
}