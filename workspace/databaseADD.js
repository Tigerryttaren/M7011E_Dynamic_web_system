var mongoose = require("mongoose");
var db = require("./database");

name : 'The Dark Side Of The Moon', parent : 'Pink Floyd', pic : 'images/fake/darkside.jpg', tracks : [ { name : 'Eclipse'}, 
{ name : 'Breathe In The Air'}, { name : 'Any Colour You Like'} ], soundslike : [ { name : 'Carolus Rex', parent : 'Sabaton', pic : 'images/fake/darkside.jpg'}, 
{ name : 'The Art Of War', parent : 'Sabaton', pic : 'images/fake/darkside.jpg' }, { name : 'Attero Dominatus', parent : 'Sabaton', pic : 'images/fake/darkside.jpg'}, 
{ name : 'Carolus Rex', parent : 'Sabaton', pic : 'images/fake/darkside.jpg' }, 
{ name : 'Primo Victoria', parent : 'Sabaton', pic : 'images/fake/darkside.jpg'} ] } ); });

//addlvl0(name, rating, picture, soundslike, info, callback)
//addlvl1(name, rating, picture, soundslike, parent, info, callback)
//addlvl2(name, rating, picture, soundslike, parent, info, callback)
database.addlvl0("Pink Floyd", 5, "http://2.bp.blogspot.com/-q1NWgSUGuAM/T4wl0JOjb3I/AAAAAAAAAEY/F22ohWy5hSY/s320/pink-floyd.jpg", [], null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl1("The Dark Side Of The Moon", 5, "http://www.92citifm.ca/files/pink_floyd_dark_side_of_the_moon13.png", [], "Pink Floyd", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl2("Speak To Me", 5, "", [], "The Dark Side Of The Moon", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl2("Breathe", 5, "", [], "The Dark Side Of The Moon", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl1("Obscured By Clouds", 5, "http://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Pink_Floyd_-_Obscured_by_Clouds.jpg/220px-Pink_Floyd_-_Obscured_by_Clouds.jpg", [], "Pink Floyd", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl2("When You're In", 5, "", [], "Obscured By Clouds", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl2("Burning Bridges", 5, "", [], "Obscured By Clouds", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})



database.addlvl0("The Who", 5, "https://www.morrisonhotelgallery.com/images/medium/The%20Who1969.jpg", [], null,function(err,res){
		console.log("err " + err + ", res "+res);
	})

database.addlvl1("Tommy", 5, "http://platform-online.net/wp-content/uploads/2012/12/cover-the_who-tommy-1969-197x200.jpg", [], "The Who", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl2("Overture", 5, "", [], "Tommy", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl2("It's A Boy", 5, "", [], "Tommy", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})

database.addlvl1("Endless Wire", 5, "http://assets-s3.rollingstone.com/assets/images/album_review/1e1d989ba31a45e0929613f3634f13a771e2c82c.jpg", [], "The Who", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl2("Fragments", 5, "", [], "Endless Wire", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})
database.addlvl2("A Man In Purple Dress", 5, "", [], "Endless Wire", null,function(err,res){
		console.log("err " + err + ", res "+res);
	})