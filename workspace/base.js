var express = require('express'), 
	app = module.exports = express(),
	fs = require('fs'),
	this_port = 8080;
	
// var passport = require('passport'), //npm install passport-google
	// GoogleStrategy = require('passport-google').Strategy;


// passport.use(new GoogleStrategy({
    // returnURL: 'http://localhost:8080/auth/google/return',
    // realm: 'http://localhost:8080'
  // },
  // function(identifier, profile, done) {
    // User.findOrCreate({ openId: identifier }, function(err, user) {
      // done(err, user);
    // });
  // }
// ));

app.use(express.bodyParser({
  uploadDir: __dirname + '/files',
  keepExtensions: true
}))


// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return

// app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.

// app.get('/auth/google/return', 
  // passport.authenticate('google', { successRedirect: '/api/user/me',
                                    // failureRedirect: '/api/user/register' }));



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

app.get('/api/user/me', function(req,res){
	console.log("\n");
	console.log("GET me");
	console.log("\n");
	res.send(200 + ' ok');
});

app.post('/api/db/content/add', function(req,res){
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
	res.send('<c>= '+c);
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/edit$/, function(req, res){
	console.log("\n");
	console.log("post <c>/edit");
	console.log("<c>= "+req.params[0]);
	console.log(req.body.token);
	console.log(req.body.parent);
	console.log(req.body.content);
	console.log("\n");
	res.send('<c> = '+req.params[0]+' token= '+ req.body.token +' parent= '+req.body.parent +' content= '+req.body.content);
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/rate$/, function(req, res){
	console.log("\n");
	console.log("post <c>/rate");
	console.log("<c>= "+req.params[0]);
	console.log(req.body.token);
	console.log(req.body.value);
	console.log("\n");
	res.send('<c> = '+req.params[0]+' token= '+ req.body.token +' value= '+req.body.value);
	
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

if (!module.parent) {
  app.listen(this_port);
  console.log('Express started on port %d', this_port);
}