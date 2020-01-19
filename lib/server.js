/*
 *server related tasks
 *
 */

 //dependencies
 var http = require('http');
 var https = require('https');
 var url = require('url');
 var StringDecoder = require('string_decoder').StringDecoder;
 var config = require('./config');
 var fs = require('fs');
 var handlers = require('./handlers');
 var helpers = require('./helpers');
 var path = require('path');
 var util = require('util');
 var debug = util.debuglog('server');

 //instantiate the server module object
 var server = {};

//instantiate the HTTP server
 server.httpServer = http.createServer(function(req,res){
    server.unifiedServer(req,res);
 });

 //instantiate the HTTPS server
 server.httpsServerOptions = {
   'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
   'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
 };

  server.httpsServer = https.createServer(server.httpsServerOptions,function(req,res){
     server.unifiedServer(req,res);
  });



//logic for both the HTTP & HTTPS server
server.unifiedServer = function(req,res){

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
      var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

      //if the request is within the public directory, use the public handler instead
      chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

      //construct data object to send to the handler
      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : helpers.parseJsonToObject(buffer)
      };

      //route the request to the handler specified in the router
      chosenHandler(data,function(statusCode,payload,contentType){

        //determine the type of response (fallback to JSON)
        contentType = typeof(contentType) == 'string' ? contentType : 'json';

        //use the status code called back by the handler, or default to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        //return the response-parts that are content-specific
        var payloadString = '';
        if (contentType == 'json') {
            res.setHeader('Content-type','application/json');
            //use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};
            //convert the payload to a string
            payloadString = JSON.stringify(payload);
        }

        if (contentType == 'html') {
          res.setHeader('Content-type','text/html');
          payloadString = typeof(payload) == 'string' ? payload : '';
        }

        if (contentType == 'favicon') {
          res.setHeader('Content-type','image/x-icon');
          payloadString = typeof(payload) !== 'undefined' ? payload : '';
        }

        if (contentType == 'css') {
          res.setHeader('Content-type','text/css');
          payloadString = typeof(payload) !== 'undefined' ? payload : '';
        }

        if (contentType == 'png') {
          res.setHeader('Content-type','image/png');
          payloadString = typeof(payload) !== 'undefined' ? payload : '';
        }

        if (contentType == 'jpg') {
          res.setHeader('Content-type','image/jpeg');
          payloadString = typeof(payload) !== 'undefined' ? payload : '';
        }

        if (contentType == 'plain') {
          res.setHeader('Content-type','text/plain');
          payloadString = typeof(payload) !== 'undefined' ? payload : '';
        }

        //return the response-parts that are common to all content-types
        res.writeHead(statusCode);
        res.end(payloadString);

        //if the response is 200 print green otherwise print red
        if (statusCode == 200) {
          debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
        } else {
          debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
        }

      });
    });
};


//define a request router
 server.router = {
   '' : handlers.index,
   'account/create' : handlers.accountCreate,
   'account/edit' : handlers.accountEdit,
   'account/deleted' : handlers.accountDeleted,
   'session/create' : handlers.sessionCreate,
   'session/deleted' : handlers.sessionDeleted,
   'checks/all' : handlers.checksList,
   'checks/create' : handlers.checksCreate,
   'checks/edit' : handlers.checksEdit,
   'ping' : handlers.ping,
   'api/users' : handlers.users,
   'api/tokens' : handlers.tokens,
   'api/checks' : handlers.checks,
   'favicon.ico' : handlers.favicon,
   'public' : handlers.public
 };

//init script
server.init = function(){
  //starting the HTTP server
  server.httpServer.listen(config.httpPort,function(){
    console.log('\x1b[36m%s\x1b[0m','server listening on port '+config.httpPort+' in '+config.envName+' mode');
  });

  //starting the HTTPS server
  server.httpsServer.listen(config.httpsPort,function(){
    console.log('\x1b[35m%s\x1b[0m','server listening on port '+config.httpsPort+' in '+config.envName+' mode');
  });
};

//export the server module
module.exports = server;
