/*
 *
 * Primary file for the API
 *
 */

 //dependencies
 var http = require('http');
 var https = require('https');
 var url = require('url');
 var StringDecoder = require('string_decoder').StringDecoder;
 var config = require('./config');
 var fs = require('fs');

//instantiate the HTTP server
 var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
 });

 //starting the HTTP server
 httpServer.listen(config.httpPort,function(){
   console.log('server listening on port '+config.httpPort+' in '+config.envName+' mode');
 });

 //instantiate the HTTPS server
 var httpsServerOptions = {
   'key' : fs.readFileSync('./https/key.pem'),
   'cert' : fs.readFileSync('./https/cert.pem')
 };

  var httpsServer = https.createServer(httpsServerOptions,function(req,res){
     unifiedServer(req,res);
  });

  //starting the HTTPS server
  httpsServer.listen(config.httpsPort,function(){
    console.log('server listening on port '+config.httpsPort+' in '+config.envName+' mode');
  });

//logic for both the HTTP & HTTPS server
var unifiedServer = function(req,res){

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
        res.setHeader('Content-type','application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        //log the responde
        console.log('returning this response: ',statusCode,payloadString);
      });
    });
};

//define the handlers
 var handlers = {};

//ping handler
handlers.ping = function(data,callback){
  callback(200);
};

//not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

//define a request router
 var router = {
   'ping' : handlers.ping
 };
