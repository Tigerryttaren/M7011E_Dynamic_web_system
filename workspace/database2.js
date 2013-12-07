
//shall we generate a username when user is created?

var mongoose = require("mongoose"),
	extend = require('mongoose-schema-extend'), //needs npm install mongoose-schema-extend, https://github.com/briankircho/mongoose-schema-extend
	Schema = mongoose.Schema;

var db = mongoose.createConnection("localhost", "soundslike");
var crypt = require("./crypt");

exports.findOrCreate = findOrCreate;
exports.addcontent;
exports.getcontent;
exports.findcontent;

var lvlSchema = new Schema({
	name: String,
	rating: Number,
	picture: String, //picture should end on .png/.jpg and is web address
	soundslike: {},
	info: String
}, {collection : 'content', discriminatorKey : '_type'});

var lvl0Schema = lvlSchema.extend({}),
	lvlxSchema = lvlSchema.extend({ parent: Number });
var userSchema = new Schema({ openID: String });

//shall this be db.model or mongoose.model, example said mongoose.model
var lvl  = db.model('lvl' , lvlSchema),
	lvl0 = db.model('lvl0', lvl0Schema), 
	lvl1 = db.model('lvl1', lvlxSchema),
	lvl2 = db.model('lvl2', lvlxSchema),
	user = db.model('user', userSchema);

function addcontent(lvl, parent, content, callback){
	//if not in db:
	db.once('open', function(){
		var current;
		switch(lvl){
			case 0:
				current = new lvl0({
					name : content.name,
					rating : content.rating,
					picture : content.picture,
					soundslike : {},
					info : content.info
				});
			case 1:
				current = new lvl1({
					name : content.name,
					rating : content.rating,
					picture : content.picture,
					soundslike : {},
					info : content.info,
					parent : content.parent
				});
			case 2:
				current = new lvl2({
					name : content.name,
					rating : content.rating,
					picture : content.picture,
					soundslike : {},
					info : content.info,
					parent : content.parent,
				});
			default:
				callback('invalid level', null);
				return
		}
		current.save(function(err){
			if (err){callback(err, null);}
			callback(null, 200);
		});
	});
}


function getcontent(key, callback){
	db.once('open', function(){
		lvl.find({name : key}, function(err, res){
			callback(err, res);
		})
	});
}

function getcontentlvl(key, lvl, callback){
	db.once('open', function(){
		var current;
		switch(lvl){
			case 0:
				lvl0.find({name : key}, function(err, res){
					callback(err, res);
				})
			case 1:
				lvl1.find({name : key}, function(err, res){
					callback(err, res);
				})
			case 2:
				lvl2.find({name : key}, function(err, res){
					callback(err, res);
				})
			default:
				callback('invalid level', null);
				return
		}
	});
}

function findUser(id, callback){ //receives salted id 
	db.once('open', function(){
		user.find({openID: id}, function(err,res){
			callback(err,res);
		});
	});
}

//This Method finds openId and returns 
//call with
//Callback(err, res)
function findOrCreate(openId, salt, callback){ 
	var saltedid = crypt.hash(openId,salt);
	
	console.log('saltedid: '+saltedid);
	
	db.once("open", function(){
		var user = db.model("users",userSchema);
		console.log('finding...');
		user.find({openID:saltedid}, function(err, res){
			if (err){
				console.log('\nERR: userfind:'+err);
				callback(err, null);
			}
			else if (res[0]){
				console.log("in callback res "+res);
				callback(err, res[0]._id);
			} else {
				console.log("in make new user");
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
