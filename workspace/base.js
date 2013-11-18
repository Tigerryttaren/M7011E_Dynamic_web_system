var express = require('express'), 
	app = module.exports = express(),

	this_port = 8080;
	
	
app.use(express.bodyParser({
  uploadDir: __dirname + '/files',
  keepExtensions: true
}))


app.post('/api/user/register', function(req,res){
	var	uname=JSON.parse(req.username),
		mail= JSON.parse(req.email),
		pass= JSON.parse(req.password);
	res.send('uname='+ uname +', mail='+ mail+', pass='+pass);
});

app.post('/api/user/login', function(req,res){
	var	uname=JSON.parse(req.username),
		pass= JSON.parse(req.password);
	res.send('uname='+ uname +', pass='+pass);
});

app.get('/api/user/me', function(req,res){
	var	tok=JSON.parse(req.token);
	res.send('token='+ tok );
});

app.post('/api/db/content/add', function(req,res){
	var	lvl=JSON.parse(req.level),
		prnt= JSON.parse(req.parent),
		cntnt= JSON.parse(req.content);
	res.send('level='+ lvl +', parent='+ prnt+', content='+cntnt);
});

app.post('/api/db/content/link', function(req,res){
	var	tok=JSON.parse(req.token),
		keyA= JSON.parse(req.key1),
		kayB= JSON.parse(req.key2);
	res.send('token='+ tok +', key1='+ keyA+', key2='+keyB);
});

app.get(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?$/, function(req, res){
		var	c = req.params[0];
		res.send('content='+c);
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/edit$/, function(req, res){
		var	ec 	    = req.params[0],
			token   = JSON.parse(req.token);
			parent  = JSON.parse(req.parent),
			content = JSON.parse(req.content);
	res.send('editc='+ec+'token='+token+'parent='+parent+'content='+content);
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/rate$/, function(req, res){
		var	rc 	    = req.params[0],
			token   = JSON.parse(req.token);
			value = JSON.parse(req.value);
	res.send('ratec='+rc+'token='+token+'value='+value);
});

app.post(/^\/api\/db\/content\/(\w+)(?:\.\.(\w+))?\/review$/, function(req, res){
		var	rec 	= req.params[0],
			token  	= JSON.parse(req.token);
			title  	= JSON.parse(req.title),
			review 	= JSON.parse(req.review);
	res.send('reviewc='+rec+'token='+token+'title='+title+'review='+review);
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