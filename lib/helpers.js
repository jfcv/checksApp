/*
 *helpers for various tasks
 *
 */

//dependencies
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');

 //container for all the helpers
 var helpers = {};

//create SHA256 hash
helpers.hash = function(str){
  if (typeof(str) == 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

//parse JSON string to an Object
helpers.parseJsonToObject = function(str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

//create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
      //define all the possible characters that could go into a string
      var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

      //start the final string
      var str = '';

      for(i = 1; i <= strLength; i++){
        //get a random character from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        //append the character to the final string
        str+=randomCharacter;
      }

      //return the final string
      return str;
    } else {
      return false;
    }
};

//send an SMS message via Twilio
helpers.sendTwilioSms = function(phone,msg,callback){
  //validate the parameters
  var phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  var msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

  if (phone && msg) {
    //configure the request payload
    var payload = {
      'From' : config.twilio.fromPhone,
      'To' : '+57'+phone,
      'Body' : msg
    };

    //stringify the payload
    var stringPayload = querystring.stringify(payload);

    //configure the request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method' : 'POST',
      'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : Buffer.byteLength(stringPayload)
      }
    };

    //instantiate the request object
    var req = https.request(requestDetails,function(res){
      //grab the status of the sent request
      var status = res.statusCode;

      //callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback('Status code returned was '+status);
      }
    });

    //bind to the header event so it doesn't get thrown
    req.on('error',function(e){
      callback(e);
    });

    //add the payload
    req.write(stringPayload);

    //end the request
    req.end();

  } else {
    callback('Given parameters were missing or invalid');
  }
};



 //export the module
 module.exports = helpers;
