/*
 *example HTTP2 server
 *
 */

//dependencies
var http2 = require('http2');

//init the server
var server = http2.createServer();

//on a stream, send back hello world html
server.on('stream',function(stream,headers) {
  stream.respond({
    'status' : 200,
    'content-type' : 'text/html'
  });

  stream.end('<html><body><<p>Hello World</p></body></html>');
});

//listen on 6000
server.listen(6000);
