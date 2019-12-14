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

//send response
   res.end('Hello World\n');

//log requested path
   console.log('request received on path: '+trimmedPath);

 });

 //start the server, listening on port 3000
 server.listen(3000,function(){
   console.log('server listening on port 3000');
 });
