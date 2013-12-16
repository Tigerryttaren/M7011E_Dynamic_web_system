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
  app.use(express["static"](__dirname + "/static"));
  app.use('/css', express.static(__dirname + '/views/css'));
  app.use('/images/fake/', express.static(__dirname + '/views/images/fake/'));
  app.use('/fonts', express.static(__dirname + '/views/fonts'));
  app.use('/js', express.static(__dirname + '/views/js'));
  app.use('C:\\fakepath\\', express.static('/tmp'));
  
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
	returnURL: 'http://54.200.238.200:'+this_port+'/auth/google/return',
	realm: 'http://54.200.238.200:'+this_port+'/'
	 // returnURL: 'http://localhost:'+this_port+'/auth/google/return',
	 // realm: 'http://localhost:'+this_port+'/'
	},

	function(identifier, profile, done) {
		process.nextTick(function () {

			profile.identifier = identifier;

			// db.findOrCreate(identifier, dbsalt, function(err, dbuser){
				// if (err) {console.log('\nErr: error in passport auth: '+err);return null;}
				return done(null, profile);
			// });
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




app.get('/', function(req,res){ res.render('index', {login : authname(req) }); });


app.get('/files/:name/:d(\\d+)', function(req,res){
		console.log('reaching for /files/:name/:d : ' + req.params.name+ " "+req.params.d);
		db.getbyname(req.params.d, req.params.name, function(err, dbres){
			if (err){console.log('\nERR: /files/name/d: '+err);}
			res.end(dbres[0].info.value.buffer, "binary");
		});
});


app.post('/results', function(req,res){
	console.log(req.body.srch);
	db.getbyname(0, req.body.srch, function(err0, response0){
		//if (err0) { console.log('\nERR: /link getbyid' + req.body.level + req.body.search); res.send(500);}
		db.getbyname(1, req.body.srch, function(err1, response1){
			//if (err1) { console.log('\nERR: /link getbyid' + req.body.level + req.body.search); res.send(500);}
			db.getbyname(2, req.body.srch, function(err2, response2){
				//if (err2) { console.log('\nERR: /link getbyid' + req.body.level + req.body.search); res.send(500);}
					res.render('results', {artists : response0 , albums : response1, tracks : response2, login : authname(req) });
			});
		});
	});
});

app.post('/link', function(req,res){
	db.getbyname(req.body.sacrifice.level, req.body.sacrifice.name, function(err1, response1){
		if (err1) { console.log('\nERR: /link getbyid' + req.body.level + req.body.search); res.send(500); }
		else if  (req.body.alike){
			db.getbyname(req.body.sacrifice.level, req.body.alike, function(err, response){
				if (err) { console.log('\nERR: /link getbyid' + req.body.level + req.body.search); res.send(500); }
				res.render('link', {sacrifice: response1[0] , soundslikelist: response, login : authname(req)});
			});
		} 
		else{
			res.render('link', {sacrifice: response1[0] , soundslikelist: [] , login : authname(req)});
		}
	});
});



app.get('/addartist', function(req,res){ res.render('addartist', {login : authname(req)} );  });
app.get('/addalbum',  function(req,res){ res.render('addalbum',  {login : authname(req)} );  });
app.get('/addtrack',  function(req,res){ res.render('addtrack',  {login : authname(req)} );  });


app.get('/api/user/me',ensureAuthenticated, function(req,res){
	console.log("\n");
	console.log("GET me");
	console.log("\n");
	res.send('Hi'+ req.user.displayName
	);
});


app.post('/api/db/content/add', function(req,res){ 
	if (req.files) {
	//if (req.files.file.type.indexOf('image/')!=-1){res.send(415);}
		makeC(req.body.name, req.files.file.path, req.body.parent, function(cres){
			db.add(parseInt(req.body.level), cres, function(err, response){
				if (err) {console.log('\nERR: content/add: '+ err); res.send(400);}
				console.log(response);
				res.redirect('/api/db/content/'+req.body.name+'/'+req.body.level);
			});
		});
	}
	else{
		db.add(parseInt(req.body.level), req.body.content, function(err, response){
			if (err) {console.log('\nERR: content/add: '+ err); res.send(400);}
			console.log(response);
			res.redirect('/api/db/content/'+req.body.content.name+'/'+req.body.level);
		});
	}
});


app.post('/api/db/content/link/:dig(\\d+)', function(req,res){
	db.getbyname(req.params.dig, req.body.key1, function(err, response){
		//if (err) {console.log('\nERR: content/c: '+err); res.send(400);}
		if(req.body.key2){
			db.getbyname(req.params.dig, req.body.key2, function(err2, response2){
				res.render('link', {sacrifice: response[0], soundslikelist : response2, lvl : req.params.dig, login : authname(req)});
			});
		}else{
			res.render('link', {sacrifice: response[0] , soundslikelist: [], lvl : req.params.dig, login : authname(req) });
		}
	});
});

app.post('/api/db/content/link/add/:dig(\\d+)', function(req,res){
	db.soundslike(req.params.dig, req.body.key1, req.body.key2, function(err, response){
		if (err) {console.log('\nERR: link/add: '+err); res.send(400);}
		res.redirect('/api/db/content/'+req.body.key1+'/'+req.params.dig);
	});
});


app.get('/api/db/content/:content/:dig(\\d+)', function(req, res){

	db.getbyname(req.params.dig, req.params.content, function(err6, response){
		console.log(err6);
		console.log(req.params.dig);
		console.log(req.params.content);
		if(!err6){ 

			switch(parseInt(req.params.dig)){
				case 0:
					console.log("artist");
					db.getbyparentlvl0(response[0].name, function(err_child, response_child){
						console.log("got by parent");
						db.getsoundslike(0,response[0].name, function(err123, response_soundslike){
							console.log("got soundslike");
							if(err_child){console.log('\nERR content/c/0 '+err123); res.send(400);}
							console.log(response_soundslike);
							res.render('artist', { 
								name: response[0].name,
								picture: response[0].picture,
								children: response_child[0],
								tracks: response_child[1],
								soundslike: response_soundslike,
								login : authname(req)
							});
						})
					});
					break;
				case 1:
					db.getbyparentlvl1(response[0].name, function(err_child, response_child){
						db.getsoundslike(1,response[0].name, function(err_soundslike, response_soundslike){
							console.log(response[0].name);
							console.log(response_soundslike);
							res.render('album',  {
								name: response[0].name,
								parent: response[0].parent,
								picture : response[0].picture,
								tracks: response_child[0],
								soundslike: response_soundslike, 
								login : authname(req)
							});
						});
					});
					break;
				case 2:

					db.getbyname(1,	response[0].parent,  function(errParent, response_parent){
						db.getbyname(0,	response_parent[0].parent,  function(errgrandParent, response_grandparent){
							db.getsoundslike(2,response[0].name, function(err_soundslike, response_soundslike){
								console.log(response_soundslike);
								res.render('track',  {
									name: response[0].name,
									parent: response_parent[0].name,
									grandparent: response_grandparent[0].name,
									picture: response_parent[0].picture,
									soundslike: response_soundslike, 
									login : authname(req)
								});
							});
						});
					});
					break;
				default:
					console.log('fail');
					break;
			}
		}
	});
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

function makeC(artist, pic, parent, callback){
	callback({ 
				name :artist, 
				parent : parent, 
				info : fs.readFileSync(pic) 
			});
}

function ensureAuthenticated(req, res, next) { 
  if (req.isAuthenticated()) { return next(); }
  console.log("Failed authentication");
  res.redirect('/auth/google');
}

function authname(req){
	console.log(req.user);
	if (req.isAuthenticated()) {return req.user.displayName}
	else {return}
}

//code to make this module listen to a port if no parents use this as a module
if (!module.parent) {
  app.listen(this_port);
  console.log('Express started on port %d', this_port);
}
