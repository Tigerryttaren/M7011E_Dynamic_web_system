var mongoose = require("mongoose");
// var db = mongoose.createConnection("localhost", "soundslike");
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
if (arg0[0]=="getbyname0") {
	database.getbyname(0, arg0[1],function(err, res){
		console.log(res);
		//var x = res[0]._id;
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

if (arg0[0]=="soundslike") {
	//soundslike(num, id1, id2, callback){
		//52a5a97026794e3573000001
	database.soundslike(0, "cooltband", "cooltband", function(res){
	
		console.log(res);
		process.exit();
	})
}
	
if (arg0[0]=="whosoundslike") {
	//soundslike(num, id1, id2, callback){
		//"52a5a96e77fb512573000001"
	//database.getbyname(0, "cooltband", function(err, res){
		database.getsoundslike("cooltband", function(res){
			console.log(res);
			process.exit();
		})
		
		
	//})
}
if (arg0[0]=="getparent") {
		database.getparent(1,"cooltband", function(err, res){
			console.log(res);
			process.exit();
		})
}
if (arg0[0]=="ratecontent") {
		database.ratecontent(0,"cooltband", 1, function(err, res){
			console.log(res);
			process.exit();
		})
}

//addlvl1(name, rating, picture, soundslike, parent, info, callback)
if (arg0[0]=="getbyparent") {
	//database.addlvl1("newalbum",5,".png",{},"cooltband","",function(err,res){
		database.getbyparentlvl1("newalbum", function(err, res1){
			console.log(res1);
			process.exit();
		})
	//})		
}
if (arg0[0]=="testgetbyname1") {
	database.getbyname(1, "newalbum",function(err, res){
		console.log(res);
	})
	}

	

if (arg0[0]=="getALLbyparent") {
	database.getbyparentlvl0("cooltband",function(err, res){

		console.log(res);
		//var x = res[2]+res[3];
		//console.log(x);

	})
	}

if (arg0[0]=="williamtest") {
	database.getbyname(0, "cooltband", function(err, response){
		console.log("HEJ WILLIAM");
		if (err) {
			console.log('\nERR: content/c: '+err); 
			console.log('nopass');
			res.send(400);
		}else{ console.log('lolpass');

	}
	})
	}


if (arg0[0]=="testaddlvl2") {
	//addlvl0(name, rating, picture, soundslike, parent, info, callback)
	
	database.addlvl1("williamalbum", 5, "http://i.imgur.com/C899nMf.gif", [], "cooltband", null,function(err,res){
		//console.log(arg0[1]);
		console.log(res);
	})
	}

if (arg0[0]=="testaddlvl3") {
	//addlvl0(name, rating, picture, soundslike, parent, info, callback)
	
	database.addlvl2("antonsong", 5, "http://i.imgur.com/C899nMf.gif", [], "williamalbum", null, function(err,res){
		//console.log(arg0[1]);
		console.log(res);
	})
	}