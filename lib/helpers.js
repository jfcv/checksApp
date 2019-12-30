/*
 *helpers for various tasks
 *
 */

//dependencies
var crypto = require('crypto');
var config = require('./config');

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






 //export the module
 module.exports = helpers;
