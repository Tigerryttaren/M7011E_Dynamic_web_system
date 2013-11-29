var mongoose = require("mongoose");
var db = mongoose.createConnection("localhost", "soundslike");
//var schemas = require("./initSchemas");
//schemas.init();
exports.getlvl0 = getlvl0;
exports.addlvl0 = addlvl0;
exports.getlvl1 = getlvl1;
exports.addlvl1 = addlvl1;
exports.getlvl2 = getlvl2;
exports.addlvl2 = addlvl2;

var lvl0Schema = new mongoose.Schema(
		{name: String},
		{info: [String]}
	);
var lvl1Schema = new mongoose.Schema(
		{name: String},
		{info: [String]}
	);
var lvl2Schema = new mongoose.Schema(
		{name: String},
		{info: [String]}
	);

//lvl01Schema.methods.sayName = function(){
//		console.log("This name: "+this.name);};




function getlvl0(artistName, callback){
	db.once("open", function(){
		var lvl0 = db.model("lvl0",lvl0Schema);
		lvl0.find({name:artistName}, function(err, res){
			callback(res);
		})
	});
}

function addlvl0(artistName, callback){
	db.once("open", function(){
		var lvl0 = db.model("lvl0",lvl0Schema);
		var metallica = new lvl0({name:"Niklas"}, {info:["Niklas", "hej"]});
		//Save entity in db
		metallica.save(function(err){
			//if (err){console.log()};
		});
		console.log("in add lvl");
		callback();
	});
}



function getlvl1(albumName, callback){
	db.once("open", function(){
		//Create a mongoose Schema
		var albumSchema = new mongoose.Schema({
			name: String});
		//Add a method to this Schema, for fun :)
		albumSchema.methods.sayName = function(){
			console.log("This name: "+this.name);
		};
		var album = db.model("lvl1",albumSchema);
		//var metallica = new artist({name:"Niklas"});
		//Save entity in db
		//metallica.save();
		//Find all name:"Niklas" and for every item found, use the method declared earlier for printing
		album.find({name:albumName}, function(err, res){
			callback(res);

			//example use of res
			//for (var i = res.length - 1; i >= 0; i--) {
			//	res[i].sayName();
			//};	
		})
	});
}
function addlvl1(albumName, callback){
	db.once("open", function(){
		var lvl1 = db.model("lvl1",lvl1Schema);
		var metallica = new lvl1({name:"Niklas"}, {info:["Niklas", "hej"]});
		//Save entity in db
		metallica.save(function(err){
			//if (err){console.log()};
		});
		console.log("in add lvl");
		callback();
	});
}

function getlvl2(trackName, callback){
	db.once("open", function(){
		//Create a mongoose Schema
		var trackSchema = new mongoose.Schema({
			name: String});
		//Add a method to this Schema, for fun :)
		trackSchema.methods.sayName = function(){
			console.log("This name: "+this.name);
		};
		var track = db.model("lvl2",trackSchema);
		//var metallica = new artist({name:"Niklas"});
		//Save entity in db
		//metallica.save();
		//Find all name:"Niklas" and for every item found, use the method declared earlier for printing
		track.find({name:trackName}, function(err, res){
			callback(res);

			//example use of res
			//for (var i = res.length - 1; i >= 0; i--) {
			//	res[i].sayName();
			//};	
		})
	});
}
function addlvl2(trackName, callback){
	db.once("open", function(){
		var lvl2 = db.model("lvl2",lvl2Schema);
		var metallica = new lvl2({name:"Niklas"}, {info:["Niklas", "hej"]});
		//Save entity in db
		metallica.save(function(err){
			//if (err){console.log()};
		});
		console.log("in add lvl");
		callback();
	});
}