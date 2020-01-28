/*
 *example TCP (Net) Server
 *Listens to port 6000 and sends the word "pong" to client
 *
 *
 */

//dependencies
var net = require('net');

//create the server
var server = net.createServer(function(connection){
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
