/*
 *example UDP server
 *creating a UDP datagram server listening on 6000
 *
 */

//dependencies
var dgram = require('dgram');

//create a server
var server = dgram.createSocket('udp4');

server.on('message',function(messageBuffer,sender){
  //do something with an incoming message or do something with the sender
  var messageString = messageBuffer.toString();
  console.log(messageString);
});

//bind to 6000 port
server.bind(6000);
