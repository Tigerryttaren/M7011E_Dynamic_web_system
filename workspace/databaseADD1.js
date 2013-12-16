var mongoose = require("mongoose");
var database = require("./database");


//addlvl0(name, rating, picture, soundslike, info, callback)
//addlvl1(name, rating, picture, soundslike, parent, info, callback)
//addlvl2(name, rating, picture, soundslike, parent, info, callback)
database.addlvl0("Metallica", 5, "http://images4.fanpop.com/image/photos/19600000/Metallica-metallica-19624250-1280-960.jpg", [], null,function(err,res){
	console.log("err " + err + ", res "+res);
	database.addlvl1("Load", 5, "http://blogs.sfweekly.com/shookdown/metallica_load-cover.jpg", [], "Metallica", null,function(err,res){
		console.log("err " + err + ", res "+res);
		database.addlvl2("Cure", 5, "", [], "Load", null,function(err,res){
			console.log("err " + err + ", res "+res);
		}
)		database.addlvl2("Ronnie", 5, "", [], "Load", null,function(err,res){
			console.log("err " + err + ", res "+res);
		})
	})
	database.addlvl1("Reload", 5, "http://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Metallica_-_Reload_cover.jpg/220px-Metallica_-_Reload_cover.jpg", [], "Metallica", null,function(err,res){
		console.log("err " + err + ", res "+res);
		database.addlvl2("Fuel", 5, "", [], "Reload", null,function(err,res){
			console.log("err " + err + ", res "+res);
		})
		database.addlvl2("Attitude", 5, "", [], "Reload", null,function(err,res){
			console.log("err " + err + ", res "+res);
		})
	})
})







database.addlvl0("Pantera", 5, "http://pintaw.com/images/wallpapers/pantera-dimebag-darrell-wallpaper.jpg", [], null,function(err,res){
	console.log("err " + err + ", res "+res);
	database.addlvl1("Walk", 5, "http://platform-online.net/wp-content/uploads/2012/12/cover-the_who-tommy-1969-197x200.jpg", [], "Pantera", null,function(err,res){
		console.log("err " + err + ", res "+res);
		database.addlvl2("Walk", 5, "", [], "Walk", null,function(err,res){
			console.log("err " + err + ", res "+res);
		})
		//database.addlvl2("It's A Boy", 5, "", [], "Tommy", null,function(err,res){
			//console.log("err " + err + ", res "+res);})
	})
	//database.addlvl1("Endless Wire", 5, "http://assets-s3.rollingstone.com/assets/images/album_review/1e1d989ba31a45e0929613f3634f13a771e2c82c.jpg", [], "Pantera", null,function(err,res){
		//onsole.log("err " + err + ", res "+res);
		//database.addlvl2("Fragments", 5, "", [], "Endless Wire", null,function(err,res){
		//	console.log("err " + err + ", res "+res);})
		//database.addlvl2("A Man In Purple Dress", 5, "", [], "Endless Wire", null,function(err,res){
			//console.log("err " + err + ", res "+res);})})
})





