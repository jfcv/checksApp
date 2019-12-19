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

    //choose the handler this request should go to. If one is not found it should go to the notFound handler
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    //construct data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    //route the request to the handler specified in the router
    chosenHandler(data,function(statusCode,payload){

      //use the status code called back by the handler, or default to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      //use the payload called back by the handler, or default to an empty object
        payload = typeof(payload) == 'object' ? payload : {};

      //convert the payload to a string
      payloadString = JSON.stringify(payload);

      //return the response
      res.writeHead(statusCode);
      res.end(payloadString);

      //log the responde
      console.log('returning this response: ',statusCode,payloadString);
    });
  });
 });

 //start the server, listening on port 3000
 server.listen(3000,function(){
   console.log('server listening on port 3000');
 });

//define the handlers
 var handlers = {};

//sample handler
 handlers.sample = function(data,callback){
   //callback an HTTP status code, and a payload object
   callback(406,{'name' : 'sample handler'})
 };

//not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

//define a request router
 var router = {
   'sample' : handlers.sample
 };
