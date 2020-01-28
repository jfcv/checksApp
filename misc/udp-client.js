/*
 *example UDP client
 *sending a message to a UDP server on port 6000
 *
 */

//dependencies
var dgram = require('dgram');

//create a client
var client = dgram.createSocket('udp4');

//define the message and pull it into a buffer
var messageString = 'This is a message';
var messageBuffer = Buffer.from(messageString);

//send off the message
client.send(messageBuffer,6000,'localhost',function(err){
  client.close();
});
