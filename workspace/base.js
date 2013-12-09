var express = require('express'), 
	app = module.exports = express(),
	fs = require('fs'), //file system
	this_port = 8081, //choose port of the program
	ejs = require('ejs');
var passport = require('passport'), 
	GoogleStrategy = require('passport-google').Strategy;
	
//local dependencies

var db = require('./database');
var sessionsalt = JSON.parse(fs.readFileSync(__dirname+'/sessionsalt.dontsave')).secret,
	dbsalt = JSON.parse(fs.readFileSync(__dirname+'/dbsalt.dontsave')).secret;

app.configure(function() {
  //these 2 sets the views to ejs files, can be used 
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  
  //overwrite filepaths
  app.use('/css', express.static(__dirname + '/views/css'));
  app.use('/images/fake/', express.static(__dirname + '/views/images/fake/'));
  app.use('/fonts', express.static(__dirname + '/views/fonts'));
  app.use('/js', express.static(__dirname + '/views/js'));
  
  //logs, parses cookies and other
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  
  //I don't know what this does
  app.use(express.methodOverride());
  
  //set the secret to a string, makes it harder to hijack sessions when salt is used
  app.use(express.session({secret : sessionsalt}));
  
  // Initialize Passport! Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  
  //I don't know what these does
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing. However, since this example does not
// have a database of user records, the complete Google profile is serialized
// and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GoogleStrategy within Passport.
// Strategies in passport require a `validate` function, which accept
// credentials (in this case, an OpenID identifier and profile), and invoke a
// callback with a user object.
passport.use(new GoogleStrategy({
	// returnURL: 'http://54.200.238.200:'+this_port+'/auth/google/return',
	returnURL: 'http://localhost:'+this_port+'/auth/google/return',
	// realm: 'http://54.200.238.200:'+this_port+'/'
	realm: 'http://localhost:'+this_port+'/'
	},

	function(identifier, profile, done) {
		process.nextTick(function () {
			//when the user logins: inser to database or check if they exist
			// User.findOrCreate({ openId: identifier }, function(err, user) {
				// done(err, user);
			// });


			// profile.identifier = identifier;
			console.log("\n");
			console.log(profile);
			console.log("\n");

			db.findOrCreate(identifier, dbsalt, function(err, dbuser){
				if (err) {console.log('\nErr: error in passport auth: '+err);return null;}
				return done(null, dbuser);
			});
			// return done(null, profile);
		});
	}
));

app.use(express.bodyParser({
  uploadDir: __dirname + '/files',
  keepExtensions: true
}))

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
// /auth/google/return
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/' }));



//end of setup




app.get('/', function(req,res){ res.render('index'); });

app.get('/album', function(req,res){ 
  res.render('album', { name : 'The Dark Side Of The Moon', parent : 'Pink Floyd', pic : 'images/fake/darkside.jpg', tracks : [ { name : 'Eclipse'}, { name : 'Breathe In The Air'}, { name : 'Any Colour You Like'} ], soundslike : [ { name : 'Carolus Rex', parent : 'Sabaton', pic : 'images/fake/darkside.jpg'}, { name : 'The Art Of War', parent : 'Sabaton', pic : 'images/fake/darkside.jpg' }, { name : 'Attero Dominatus', parent : 'Sabaton', pic : 'images/fake/darkside.jpg'}, { name : 'Carolus Rex', parent : 'Sabaton', pic : 'images/fake/darkside.jpg' }, { name : 'Primo Victoria', parent : 'Sabaton', pic : 'images/fake/darkside.jpg'} ] } ); });

app.get('/track', function(req,res){ res.render('album'); });




app.get('/artist', function(req,res){
  res.render('artist', { name: 'Raubtier', pic : 'images/fake/pinkfloyd.jpg', children: [ {name : 'Från Norrland Till Helvetets Port', pic : 'images/fake/darkside.jpg'}, { name: 'Skriet Från Vildmarken', pic : 'images/fake/darkside.jpg'}, { name: 'Det Finns Bara Krig', pic : 'images/fake/darkside.jpg'} ], rating: '* * * * *', soundslike : [{name : 'Rammstein'},{name : 'Rammstein'},{name : 'Rammstein'}, {name : 'Sabaton'}, {name : 'Rammstein'}], toptracks : [ {name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'}, {name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'}, {name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'}, {name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'}, {name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'}, {name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'},{name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'},{name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'},{name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'},{name : 'Allt Förlorat', album : 'Från Norrland Till Helvetets Port'} ] });
});

app.post('/results', function(req,res){
	console.log(req.body.srch);
  res.render('results', { artists : [{ name : 'Pink 1 Floyd', pic : 'images/fake/pinkfloyd.jpg'}, { name : 'Pink 2 Floyd', pic : 'images/fake/pinkfloyd.jpg'}, { name : 'Pink 3 Floyd', pic : 'images/fake/pinkfloyd.jpg'}, { name : 'Pink 4 Floyd', pic : 'images/fake/pinkfloyd.jpg'}, { name : 'Pink 5 Floyd', pic : 'images/fake/pinkfloyd.jpg'} ], albums : [ {name : 'The Dark Side Of The Moon', pic : 'images/fake/darkside.jpg', parent : 'Pink Floyd'}, {name : 'The Dark Side Of The Moon', pic : 'images/fake/darkside.jpg', parent : 'Pink Floyd'} ], tracks : [ { name : 'Any Colour You Like', album : 'The Dark Side Of The Moon', pic : 'images/fake/darkside.jpg', artist : 'Pink Floyd' }, { name : 'The Great Gig In The Sky', album : 'The Dark Side Of The Moon', pic : 'images/fake/darkside.jpg', artist : 'Pink Floyd' }, { name : 'Time', album : 'The Dark Side Of The Moon', pic : 'images/fake/darkside.jpg', artist : 'Pink Floyd' }, { name : 'Breathe In The Air', album : 'The Dark Side Of The Moon', pic : 'images/fake/darkside.jpg', artist : 'Pink Floyd' }, { name : 'Money', album : 'The Dark Side Of The Moon', pic : 'images/fake/darkside.jpg', artist : 'Pink Floyd' }, { name : 'Eclipse', album : 'The Dark Side Of The Moon', pic : 'images/fake/darkside.jpg', artist : 'Pink Floyd' }, { name : 'Speak To Me', album : 'The Dark Side Of The Moon', pic : 'images/fake/darkside.jpg', artist : 'Pink Floyd' } ] }  );
});

app.post('/link', function(req,res){
	//info that i needs:
	//lvl
	//sacrificename
	db.getbyname(req.body.sacrifice.level, req.body.sacrifice.name, function(err1, response1){
		if (err1) { console.log('\nERR: /link getbyid' + req.body.level + req.body.search); res.send(500); }
		else if  (req.body.alike){
			db.getbyname(req.body.sacrifice.level, req.body.alike, function(err, response){
				if (err) { console.log('\nERR: /link getbyid' + req.body.level + req.body.search); res.send(500); }
				res.render('link', {sacrifice: response1[0] , soundslikelist: response});
			});
		} 
		else{
			res.render('link', {sacrifice: response1[0] , soundslikelist: [] });
		}
	});
//===================================
  // res.render('link', {
  // sacrifice: {name: 'Dark Anton of the Anton', parent: 'The Anton', imgurl: 'https://pbs.twimg.com/profile_images/3544461245/03044f4e9bb46793afa538ae28dc33a3.png'},
  // soundslikelist: [
					// {name: 'Anton side of the moon', parent: 'Antons mamma', imgurl: 'http://img.laget.se/2692915.jpg'},
					// {name: 'Dark side of Anton', parent: 'Antons pappa', imgurl: 'https://pbs.twimg.com/profile_images/378800000695072052/973895f817ea5419ad1ed101374c5991.jpeg'},
					// {name: 'Dark Anton of the moon', parent: 'Antons bror', imgurl: 'https://pbs.twimg.com/profile_images/3622800908/def779d8ce92eb727bc7f62491c3d3f5.jpeg'}]
	 //});
});



app.get('/addartist', function(req,res){ res.render('addartist'); });
app.get('/addalbum',  function(req,res){ res.render('addalbum');  });
app.get('/addtrack',  function(req,res){ res.render('addtrack');  });


// I Believe these are unneeded since google authentication takes care of it

// app.post('/api/user/register', function(req,res){
	// console.log("\n");
	// console.log("POST register");
	// console.log(req.body.username);
	// console.log(req.body.email);
	// console.log(req.body.password);
	// console.log("\n");
	// res.send('uname='+ req.body.username +', mail= ' + req.body.email + ', pass='+req.body.password);
// });

// app.post('/api/user/login', function(req,res){
	// console.log("\n");
	// console.log("POST login");
	// console.log(req.body.username);
	// console.log(req.body.password);
	// console.log("\n");
	// res.send('uname='+ req.body.username + ', pass='+req.body.password);
	
// });

app.get('/api/user/me',ensureAuthenticated, function(req,res){
	console.log("\n");
	console.log("GET me");
	console.log("\n");
	res.send('Here you are :)');
});

app.post('/api/db/content/add', function(req,res){ 
	console.log(req.body.level + " " + req.body.content + " " +req.body)
	db.add(parseInt(req.body.level), req.body.content, function(err, response){
		if (err) {console.log('\nERR: content/add: '+ err);}
		console.log(response);
		res.send(200);
	});
	// console.log("\n\n"+req.body.level +" "+req.body.content.name+" "+req.body.content.parent+" "+req.body.content.picture+" "+req.body.content+"\n");
	// res.send(200); // answer is sync
});

app.get('/api/db/content/link', function(req,res){ //atm only response is the sent artist
	db.getcontent(req.body.key, function(err, response){
		if (err) {console.log('\nERR: content/c: '+err); res.send(400);}
		res.send(response); //answer is sync
	});
});

app.post('/api/db/content/link', function(req,res){
	console.log("\n");
	console.log("POST link");
	console.log(req.body.key1);
	console.log(req.body.key2);
	console.log("\n");
	res.send(' key1= '+req.body.key1 +' key2= '+req.body.key2);
});

app.get(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/d$/, function(req, res){
	db.getbyname(req.params.[1], req.params[0], function(err, response){
		if (err) {console.log('\nERR: content/c: '+err); res.send(400);}
		
		// res.send(response); //answer is sync
		switch(req.params.[1]){
			case 0:
				//TODO getbyparent
				res.render('artist', { 
					name: response[0].name,
					children: [response2.forEach(function(entry){entry.name})],
					soundslike: response[0].soundslike,
					});
				});
				break;
			case 1:
				res.render('album',  {});
				break;
			case 2:
				res.render('track',  {});
				break;
		}
		res.render('');
	});
	// console.log("\nWelcome to content/something");
	// res.send();
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/edit$/, function(req, res){
	console.log("\n");
	console.log("post <c>/edit");
	console.log("<c>= "+req.params[0]);
	console.log(req.body.parent);
	console.log(req.body.content);
	console.log("\n");
	res.send('c = '+req.params[0]+' parent= '+req.body.parent +' content= '+req.body.content);
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/rate$/, function(req, res){
	console.log("\n");
	console.log("post <c>/rate");
	console.log("<c>= "+req.params[0]);
	console.log(req.body.value);
	console.log("\n");
	res.send('c = '+req.params[0]+' value= '+req.body.value);
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/review$/, function(req, res){
	console.log("\n");
	console.log("post <c>/review");
	console.log("<c>= "+req.params[0]);
	console.log(req.body.title);
	console.log(req.body.review)
	console.log("\n");
	res.send('c = '+req.params[0]+' title= '+req.body.title+ ' review= '+req.body.review);
});






// error handling middleware.
app.use(function(err, req, res, next){
  // special-case 404s,
  if (404 == err.status) {
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  } 
  else if (500 == err.status) {
    res.statusCode = 500;
    res.send(500 +' internal server error, see console');
  }
  else {
    next(err);
  }
});

//Below are functions usable in the other functions

function ensureAuthenticated(req, res, next) { //this should probably be changed to if db.findUser(req.user).unsalt.isauthenticated , but i will test first
  if (req.isAuthenticated()) { return next(); }
  console.log("Failed authentication");
  res.redirect('/auth/google');
}

//code to make this module listen to a port if no parents use this as a module
if (!module.parent) {
  app.listen(this_port);
  console.log('Express started on port %d', this_port);
}
