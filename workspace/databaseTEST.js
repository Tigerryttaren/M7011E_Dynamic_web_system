var mongoose = require("mongoose");
var db = mongoose.createConnection("localhost", "soundslike");
var database = require("./database");
//var schemas = require("./initSchemas");
//schemas.init();
var database = require("./database");
//initi();
//addlvl0("Niklas", function(err, res){});
//Find
var arg0 = process.argv.splice(2);
if (arg0[0]=="Findlvl0") {
	database.getlvl0(arg0[1], function(res){
		console.log(res);
	});
};
if (arg0[0]=="Addlvl0") {
	var x = ["test", "hej"];
	database.addlvl0(arg0[1], x, function(){console.log("item added?");});
	
};
