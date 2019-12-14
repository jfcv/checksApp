/*
 *
 * Primary file for the API
 *
 */

 //dependencies
 var http = require('http');

//the server should respond to all requests with a string
 var server = http.createServer(function(req,res){
   res.end('Hello World\n');
 });

 //start the server, listening on port 3000
 server.listen(3000,function(){
   console.log('server listening on port 3000');
 });
