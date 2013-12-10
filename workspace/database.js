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
exports.ratecontent=ratecontent;
exports.getbyparentlvl0=getbyparentlvl0;
exports.addlvl1=addlvl1;
exports.getbyparentlvl1=getbyparentlvl1;


var lvl0Schema = new mongoose.Schema({
		name: String,
		rating: Number,
		//picture should end on .png/.jpg and is web address
		picture: String,
		soundslike: [],
		info: String
	});
var lvl1Schema = new mongoose.Schema({
		name: String,
		rating: Number,
		picture: String,
		soundslike: [],
		parent: String,
		info: String
	});
var lvl2Schema = new mongoose.Schema({
		name: String,
		rating: Number,
		picture: String,
		soundslike: [],
		parent: String,
		info: String
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
	//db.once("open", function(){
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
	//})
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
	//db.once("open", function(){
		lvl.find({name:Name}, function(err, res){
			//console.log(res.length);
			console.log('res: '+res);
			if(res.length==0){callback("error: is empty", null)}
			callback(err, res);
		})}
	//})

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
	//db.once("open", function(){
		lvl.find({_id:Name}, function(err, res){
			callback(err, res);
	//})
	})}

function addlvl0(name, rating, picture, soundslike, info, callback){
	//db.once("open", function(){
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
			else{callback(null, "success")}
		});
	//});
	}

function addlvl1(name, rating, picture, soundslike, parent, info, callback){
	
	var lvl1 = db.model("lvl1",lvl1Schema);
	//db.once("open", function(){
	
	
		
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
			else{callback(null, "success")}
		});
	//});
	}

function addlvl2(name, rating, picture, soundslike, parent, info, callback){
	//db.once("open", function(){
	var lvl1 = db.model("lvl1",lvl1Schema);
	lvl1.find({name:parent}, function(err, res){
		if (res  ) {};
	})
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
			else{callback(null, "success")}
		});
	//});
	}

function getsoundslike(name, callback){
	
	//db.once("open", function(){
		
	var lvl0 = db.model("lvl0",lvl0Schema);
	lvl0.find({name:name}, function(err, ras){
		var soundslikeJSON =ras[0].soundslike
		//console.log(ras[0].soundslike)
		
		//console.log(soundslikeJSON);
		//var array = [];
		////var count = 0;
		//console.log(soundslikeJSON.length);
		var newarray=[];
		if (soundslikeJSON.length == 0) {
			callback([]);
		}
		if (soundslikeJSON.length == 1) {
			lvl0.find({name:soundslikeJSON[0]}, function(err, res){
				newarray.push(res[0]);
				
				callback(newarray);
			})
		}
		if (soundslikeJSON.length == 2) {
			lvl0.find({name:soundslikeJSON[0]}, function(err, res){
				newarray.push(res[0]);
				lvl0.find({name:soundslikeJSON[1]}, function(err, res1){
					newarray.push(res1[0]);
					
					callback(newarray);
				})
			})
		}
		if (soundslikeJSON.length == 3) {
			
			lvl0.find({name:soundslikeJSON[0]}, function(err, res){
				newarray.push(res[0]);
				lvl0.find({name:soundslikeJSON[1]}, function(err, res1){
					newarray.push(res1[0]);
					lvl0.find({name:soundslikeJSON[2]}, function(err, res2){
						newarray.push(res2[0]);
						callback(newarray);
					})	
				})	
			})
		};
		if (soundslikeJSON.length == 4) {
			lvl0.find({name:soundslikeJSON[0]}, function(err, res){
				newarray.push(res[0]);
				lvl0.find({name:soundslikeJSON[1]}, function(err, res1){
					newarray.push(res1[0]);
					lvl0.find({name:soundslikeJSON[2]}, function(err, res2){
						newarray.push(res2[0]);
						
						
						lvl0.find({name:soundslikeJSON[3]}, function(err, res3){
							newarray.push(res3[0]);
							callback(newarray);
						})
					})
				})
			})
		};
		if (soundslikeJSON.length > 4) {
			lvl0.find({name:soundslikeJSON[0]}, function(err, res){
				newarray.push(res[0]);
				lvl0.find({name:soundslikeJSON[1]}, function(err, res1){
					newarray.push(res1[0]);
					lvl0.find({name:soundslikeJSON[2]}, function(err, res2){
						newarray.push(res2[0]);
						
						
						lvl0.find({name:soundslikeJSON[3]}, function(err, res3){
							newarray.push(res3[0]);
							
							lvl0.find({name:soundslikeJSON[4]}, function(err, res4){
								newarray.push(res4[0]);
								callback(newarray);
							})
						})
					})
				})	
			})
		};
	//});
	})
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

	
	lvl.find({name:id1}, function(err, res){
		lvl.find({name:id2}, function(err, res1){
			var id1name = res[0].soundslike;
			id1name.push(res1[0].name);
			lvl.update({name:id1}, {$set: {soundslike: id1name}}, {upsert: true}, function(err, res3){
				var id2name = res1[0].soundslike;
				id2name.push(res[0].name);
				lvl.update({name:id2}, {$set: {soundslike: id2name}}, {upsert: true}, function(err, res4){
					callback("success");
				})
			})
	})})
	}

function add(lvl, content, callback){
	console.log("in add");//lvl +""+ (1===lvl));
       switch(lvl){
               case 0:
                       	addlvl0(content.name, 0, content.picture, [], "", callback);
                       	break;
               case 1: 
               			addlvl1(content.name, 0, content.picture, [], content.parent, "", callback);
               			break;
               case 2:
                       	addlvl2(content.name, 0, "", [], content.parent, "", callback);
                       	break;
               default:
                       	callback('invalid level', null);
                       	return;
       }
       //console.log('\ERR: db.add '+ lvl + content + callback);
	}

function ratecontent(lvl, name, rating, callback){
	if (lvl == 0) {
		var lvl0 = db.model("lvl0",lvl0Schema);
		lvl0.update({name:name}, {$set: {rating:rating}},function(err, res){
			callback(err, res);
		})
	}
	if (lvl == 1) {
		var lvl1 = db.model("lvl1",lvl1Schema);
		lvl1.update({name:name}, {$set: {rating:rating}},function(err, res){
			callback(err, res);
		})
	}
	if (lvl == 2) {
		var lvl2 = db.model("lvl2",lvl2Schema);
		lvl2.update({name:name}, {$set: {rating:rating}},function(err, res){
			callback(err, res);
		})
	}
	callback("error in ratecontent",null);
	}

function getbyparentlvl1(parent, callback){
	var returnarray = [];
	var lvl1 = db.model("lvl1",lvl1Schema);
	var lvl2 = db.model("lvl2",lvl2Schema);
	console.log(parent);
	//lvl1.find({parent:parent}, function(err, res){
		//returnarray.push(res);
		lvl2.find({parent:parent}, function(err,res1){
			returnarray.push(res1);
			callback(err, returnarray);
		})
	//})
	}

function getbyparentlvl0(parent, callback){
	var returnarray = [];
	var lvl1 = db.model("lvl1",lvl1Schema);
	var lvl2 = db.model("lvl2",lvl2Schema);
	console.log(parent);
	lvl1.find({parent:parent}, function(err, res){
		returnarray.push(res);
		//lvl2.find({parent:parent}, function(err,res1){
			//returnarray.push(res1);
			//callback(err, returnarray);
			for (var i = res.length - 1; i >= 0; i--) {
				console.log(res[i].name);
				var j=0
				var x = [];
				lvl2.find({parent:res[i].name}, function(err, res2){
					res2.forEach(function(foreach){
						x.push(foreach);
					})
					j++;
					
					if (j == res.length) {
						returnarray.push(x);
						callback(err, returnarray)};
				});

			};
		//})
	})
}
