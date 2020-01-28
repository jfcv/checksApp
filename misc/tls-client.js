/*
 *example TLS Client
 *Connects to port 6000 and sends the word "ping" to server
 *
 *
 */

 //dependencies
 var tls = require('tls');
 var fs = require('fs');
 var path = require('path');

 //server options
 var options = { //only required because when are using a self-signed certificate
   'ca' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
 };

//define the message to send
var outboundMessage = 'ping';

//create the client
var client = tls.connect(6000,options,function(){
  //send the message
  client.write(outboundMessage);
});

//when the server writes back, log what it says then kill the client
client.on('data',function(inboundMessage){
  var messageString = inboundMessage.toString();
  console.log('I wrote '+outboundMessage+' and they said '+messageString);
  client.end();
})
