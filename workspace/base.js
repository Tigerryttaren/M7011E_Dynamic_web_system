var express = require('express'), 
	app = module.exports = express(),
	fs = require('fs'), //file system
	this_port = 8080; //choose port of the program
	
var passport = require('passport'), 
	GoogleStrategy = require('passport-google').Strategy;
	
//local dependencies
// var db = require('./database');
var salt = JSON.parse(fs.readFileSync(__dirname+'/salt.dontsave'));

app.configure(function() {
  //these 2 sets the views to ejs files, can be used 
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  //logs, parses cookies and other
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  
  //I don't know what this does
  app.use(express.methodOverride());
  
  //set the secret to a string, makes it harder to hijack sessions when salt is used
  app.use(express.session({secret : salt.secret}));
  
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
	returnURL: 'http://54.200.238.200:8080/auth/google/return',
	realm: 'http://54.200.238.200:8080/'
	},

	function(identifier, profile, done) {
		process.nextTick(function () {
			//when the user logins: inser to database or check if they exist

			// User.findOrCreate({ openId: identifier }, function(err, user) {
				// done(err, user);
			// });

				// To keep the example simple, the user's Google profile is returned to
				// represent the logged-in user. In a typical application, you would want
				// to associate the Google account with a user record in your database,
				// and return that user instead.
			db.findOrCreate(profile, salt);
			console.log("\n");
			console.log(profile);
			console.log("\nHello mr " + profile.name.familyName);
			console.log("\n");
			profile.identifier = identifier;
			return done(null, profile);
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
                                    failureRedirect: '/api/user/register' }));



//end of setup




app.get('/', function(req,res){
	fs.readFile('./basetest.html', function(err, file) {  
	if(err) {return;}  
		res.writeHead(200, { 'Content-Type': 'text/html' });  
		res.end(file, "utf-8");  
	});
});

app.post('/api/user/register', function(req,res){
	console.log("\n");
	console.log("POST register");
	console.log(req.body.username);
	console.log(req.body.email);
	console.log(req.body.password);
	console.log("\n");
	res.send('uname='+ req.body.username +', mail= ' + req.body.email + ', pass='+req.body.password);
});

app.post('/api/user/login', function(req,res){
	console.log("\n");
	console.log("POST login");
	console.log(req.body.username);
	console.log(req.body.password);
	console.log("\n");
	res.send('uname='+ req.body.username + ', pass='+req.body.password);
	
});

app.get('/api/user/me',ensureAuthenticated, function(req,res){
	console.log("\n");
	console.log("GET me");
	console.log("\n");
	res.send(200 + ' ok');
});

app.post('/api/db/content/add',ensureAuthenticated, function(req,res){
	console.log("\n");
	console.log("POST add");
	console.log(req.body.token);
	console.log(req.body.level);
	console.log(req.body.parent);
	console.log(req.body.content);
	console.log("\n");
	res.send('level='+ req.body.level +', parent='+ req.body.parent+', content='+req.body.content);
});

app.get('/api/db/content/link', function(req,res){
	console.log("\n");
	console.log("GET link");
	console.log(req.body.token);
	console.log(req.body.key);
	console.log("\n");
	res.send('token= '+ req.body.token +' key= '+req.body.key);
});

app.post('/api/db/content/link', function(req,res){
	console.log("\n");
	console.log("POST link");
	console.log(req.body.token);
	console.log(req.body.key1);
	console.log(req.body.key2);
	console.log("\n");
	res.send('token= '+ req.body.token +' key1= '+req.body.key1 +' key2= '+req.body.key2);
});

app.get(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?$/, function(req, res){
	console.log("\n");
	console.log("GET db/content/<c>");
	var	c = req.params[0];
	console.log('<c>='+c);
	res.send('c= '+c);
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/edit$/, function(req, res){
	console.log("\n");
	console.log("post <c>/edit");
	console.log("<c>= "+req.params[0]);
	console.log(req.body.token);
	console.log(req.body.parent);
	console.log(req.body.content);
	console.log("\n");
	res.send('c = '+req.params[0]+' token= '+ req.body.token +' parent= '+req.body.parent +' content= '+req.body.content);
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/rate$/, function(req, res){
	console.log("\n");
	console.log("post <c>/rate");
	console.log("<c>= "+req.params[0]);
	console.log(req.body.token);
	console.log(req.body.value);
	console.log("\n");
	res.send('c = '+req.params[0]+' token= '+ req.body.token +' value= '+req.body.value);
	
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



//Below are functions usable in the other functions


// error handling middleware. Because it's
// below our routes, you will be able to
// "intercept" errors, otherwise Connect
// will respond with 500 "Internal Server Error".
app.use(function(err, req, res, next){
  // special-case 404s,
  // remember you could
  // render a 404 template here
  if (404 == err.status) {
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  } else {
    next(err);
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  console.log("Failed authentication");
  res.redirect('/login');
}

//code to make this module listen to a port if no parents use this as a module
if (!module.parent) {
  app.listen(this_port);
  console.log('Express started on port %d', this_port);
}