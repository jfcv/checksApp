/*
 *example TCP (Net) Client
 *Connects to port 6000 and sends the word "ping" to server
 *
 *
 */

//dependencies
var net = require('net');

//define the message to send
var outboundMessage = 'ping';

//create the client
var client = net.createConnection({'port' : 6000},function(){
  //send the message
  client.write(outboundMessage);
});

//when the server writes back, log what it says then kill the client
client.on('data',function(inboundMessage){
  var messageString = inboundMessage.toString();
  console.log('I wrote '+outboundMessage+' and they said '+messageString);
  client.end();
})
