var express = require('express'), 
	app = module.exports = express(),

	this_port = 8080;
	
	
app.use(express.bodyParser({
  uploadDir: __dirname + '/files',
  keepExtensions: true
}))


app.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, function(req, res){
  var from = req.params[0];
  res.send('commit range ' + from);
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