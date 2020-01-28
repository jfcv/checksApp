/*
 *example TLS Server
 *Listens to port 6000 and sends the word "pong" to client
 *
 *
 */

//dependencies
var tls = require('tls');
var fs = require('fs');
var path = require('path');

//server options
var options = {
  'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
  'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};

//create the server
var server = tls.createServer(options,function(connection){
  //send the word "pong"
  var outboundMessage = 'pong';
  connection.write(outboundMessage);

  //when the client writes something, log it out
  connection.on('data',function(inboundMessage){
      var messageString = inboundMessage.toString();
      console.log('I wrote '+outboundMessage+' and they said '+messageString);
  });
});

//listen
server.listen(6000);
