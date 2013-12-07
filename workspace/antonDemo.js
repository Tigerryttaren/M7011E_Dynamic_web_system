var express = require('express'), 
	app = module.exports = express(),
	fs = require('fs'), //file system
	this_port = 8081; //choose port of the program

app.use('/css', express.static(__dirname + '/views/css'));
app.use('/images/fake/', express.static(__dirname + '/views/images/fake/'));

app.get('/', function(req,res){
	fs.readFile('./views/index.html', function(err, file) {  
		if(err) {return;}  
		res.writeHead(200, { 'Content-Type': 'text/html' });  
		res.end(file, "utf-8");  
		
	});
});

app.get('/results.html', function(req,res){
	fs.readFile('./views/results.html', function(err, file) {  
		if(err) {return;}  
		res.writeHead(200, { 'Content-Type': 'text/html' });  
		res.end(file, "utf-8");  
		
	});
});

app.get('/artist.html', function(req,res){
	fs.readFile('./views/artist.html', function(err, file) {  
		if(err) {return;}  
		res.writeHead(200, { 'Content-Type': 'text/html' });  
		res.end(file, "utf-8");  
		
	});
});

//code to make this module listen to a port if no parents use this as a module
if (!module.parent) {
  app.listen(this_port);
  console.log('Express started on port %d', this_port);
}
