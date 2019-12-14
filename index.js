/*
 *
 * Primary file for the API
 *
 */

 //dependencies
 var http = require('http');
 var url = require('url');

//the server should respond to all requests with a string
 var server = http.createServer(function(req,res){

//get and parse the URL
  var parsedUrl = url.parse(req.url,true);

//get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

//get the query string as an object
  var queryStringObject = parsedUrl.query;

//get HTTP method
  var method = req.method.toLowerCase();

//send response
  res.end('Hello World\n');

//log requested path
  console.log('request received on path: '+trimmedPath+' with the method: '+method+' & with these query string parameters: ',queryStringObject);

 });

 //start the server, listening on port 3000
 server.listen(3000,function(){
   console.log('server listening on port 3000');
 });
