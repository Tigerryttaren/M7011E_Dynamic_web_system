var mongoose = require("mongoose");
//var db = mongoose.createConnection("localhost", "soundslike");
var database = require("./database");
//var schemas = require("./initSchemas");
//schemas.init();
//var database = require("./database");
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
if (arg0[0]=="testgetbyname0") {
	database.getbyname(0, arg0[1],function(err, res){
		console.log(res);
		var x = res[0]._id;
		console.log(x);
	})
	}
if (arg0[0]=="testgetany") {
	database.getany(0, "name","Niklas",function(err, res){
		console.log(res);
	})
	}
if (arg0[0]=="testgetid") {
	database.getbyid(0, arg0[1],function(err, res){
		//console.log(arg0[1]);
		console.log(res);
	})
	}
if (arg0[0]=="testaddlvl0") {
	//addlvl0(name, rating, picture, soundslike, parent, info, callback)
	var c = [{extras:"none"}];
	c.push({extras:"this"});
	database.addlvl0("cooltband", 5, "mypicture", [], null,function(res){
		//console.log(arg0[1]);
		console.log(res);
	})
	}
if (arg0[0]=="testsoundslike") {
	//getsoundslike(lvl, soundslikeJSON, callback){
	//database.getbyname(0, arg0[1],function(err, res){
		//console.log(res);
		//var x = res[0].soundslike;
		//console.log(x);
		database.getsoundslike([{_id:"52a5867f29ae46496a000001"},{_id:"52a5867f29ae46496a000001"},{_id:"52a5867f29ae46496a000001"},{_id:"52a5867f29ae46496a000001"},{_id:"52a5867f29ae46496a000001"},{_id:"52a5867f29ae46496a000001"}],function(res){
			//console.log(arg0[1]);
			console.log(res);
		});
	//});
}
if (arg0[0]=="soundslike") {
	//soundslike(num, id1, id2, callback){
	database.soundslike(0, "52a5a96e77fb512573000001", "52a5a97026794e3573000001", function(res){
	
		console.log(res);
		process.exit();
	})
}
	
