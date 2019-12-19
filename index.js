/*
 *
 * Primary file for the API
 *
 */

 //dependencies
 var http = require('http');
 var url = require('url');
 var StringDecoder = require('string_decoder').StringDecoder;

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

//get the headers
  var headers = req.headers;

//get the payload, if any
  var decoder = new StringDecoder;
  var buffer = '';
  req.on('data',function(data){
      buffer += decoder.write(data);
  });
  req.on('end',function(){
    buffer += decoder.end();

    //send response
      res.end('Hello World\n');

    //log requested path
      console.log('request received with this payload:',buffer);

  });
 });

 //start the server, listening on port 3000
 server.listen(3000,function(){
   console.log('server listening on port 3000');
 });
