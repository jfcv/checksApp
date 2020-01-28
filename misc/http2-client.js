/*
 *example HTTP2 client
 *
 */

//dependencies
var http2 = require('http2');

//create a client
var client = http2.connect('http://localhost:6000');

//create a request
var req = client.request({
  'path' : '/'
});

//when a message is received,, add the pieces of it together until you reach the end
str = '';
req.on('data',function(chunk){
  str+=chunk;
});

//when the message ends, log it out
req.on('end',function(){
  console.log(str);
});

//end  the request
req.end();
