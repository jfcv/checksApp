/*
 *request handlers
 *
 */


//dependencies
var _data = require('./data');
var helpers = require('./helpers');

//magic numbers
const milisecsInASec = 1000;
const secsInAMin = 60;
const minsInAnHour = 60;

//define the handlers
 var handlers = {};

//users handler
handlers.users = function(data,callback) {
  //define acceptable methods
  var acceptableMethods = ['post','get','put','delete'];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data,callback);
  }else {
    callback(405); //http status code for method not allowed
  }
}

//container for user submethods
handlers._users = {};

/*
post
required data: firstName, lastName, phone, password, tosAgreement
optional data: none
*/
handlers._users.post = function(data,callback){
  //check all required fields are filled out
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    //check if the user exists
    _data.read('users',phone,function(err,data){
      if (err) {

        //hash the password
        var hashedPassword = helpers.hash(password);

        //check if hashedPassword exists
        if (hashedPassword) {

          //create the user object
          var userObject = {
            'firstName' : firstName,
            'lastName' : lastName,
            'phone' : phone,
            'hashedPassword' : hashedPassword,
            'tosAgreement' : tosAgreement
          };

          //store the user
          _data.create('users',phone,userObject,function(err){
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500,{'Error':'Could not create the new user'});
            }
          });
        } else {
          callback(500,{'Error':'Could not hash the user\'s password'});
        };

      } else {
        callback(400,{'Error':'A user with that phone number already exists'});
      }
    });

  } else {
    callback(400,{'Error':'Missing required fields'});
  }
};

/*
get
required data: phone
optional data: none
@TODO only let an authenticated user access their object. Don't expose private information
*/
handlers._users.get = function(data,callback){
  //check if the phone number is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone : false;
  if (phone) {
    //lookup for the user
    _data.read('users',phone,function(err,data){
      if (!err && data) {
        //remove hashedPassword from the user userObject before giving it to the requester
        delete data.hashedPassword;
        callback(200,data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400,{'Error':'Missing required field'});
  }
};

/*
put
required data: phone
optional data: firstName, lastName, password (at least one must be specified)
@TODO only let an authenticated user update their own object. Don't expose private information
*/
handlers._users.put = function(data,callback){
  //check for the required field
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false;

  //check for the optional fields
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  //error if the phone is invalid
  if (phone) {
    //error if nothing's sent for update
    if (firstName || lastName || password) {
      //lookup the user
      _data.read('users',phone,function(err,userData){
        if (!err && userData) {

          //update the chosen fields
          if (firstName) {
            userData.firstName = firstName;
          }

          if (lastName) {
            userData.lastName = lastName;
          }

          if (password) {
            userData.hashedPassword = helpers.hash(password);
          }

          //store the new updates
          _data.update('users',phone,userData,function(err){
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500,{'Error':'Could not update the user'});
            }
          });

        } else {
          callback(400,{'Error':'The specified user does not exist'})
        }
      });
    } else {
      callback(400,{'Error':'Missing fields to update'});
    }
  } else {
    callback(400,{'Error':'Missing required field'});
  }
};

/*
delete
required field: phone
@TODO only let an authenticated user delete their object. Don't let anyone else delete the other's object
@TODO cleanup (remove) any other data file associated with the user deleted
*/
handlers._users.delete = function(data,callback){
  //check the required field
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone : false;
  if (phone) {
    //lookup for the user
    _data.read('users',phone,function(err,data){
      if (!err && data) {
        //delete the user
        _data.delete('users',phone,function(err){
          if (!err) {
            callback(200);
          } else {
            callback(500,{'Error':'Could not delete the specified user'});
          }
        });
      } else {
        callback(400,{'Error':'Could not find the specified user'});
      }
    });
  } else {
    callback(400,{'Error':'Missing required field'});
  }
};

//tokens handler
handlers.tokens = function(data,callback) {
  //define acceptable methods
  var acceptableMethods = ['post','get','put','delete'];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data,callback);
  }else {
    callback(405); //http status code for method not allowed
  }
}

//container for all tokens methods
handlers._tokens = {};

/*
tokens post
required data: phone, password
optional data: none
*/
handlers._tokens.post = function(data,callback){
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if (phone && password) {
    //lookup the user who matches that phone number
    _data.read('users',phone,function(err,userData){
      if (!err && userData) {
        //hash the sent password, && compare to one stored in the user data object
        var hashedPassword = helpers.hash(password);
        console.log('passwords matched!');
        if (hashedPassword == userData.hashedPassword) {
          //if valid, create a new token {random name, expiration date: 1 hour}
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + (milisecsInASec * secsInAMin * minsInAnHour);
          var tokenObject = {
            'phone' : phone,
            'id' : tokenId,
            'expires' : expires
          };

          //store the token
          _data.create('tokens',tokenId,tokenObject,function(err) {
            if (!err) {
              callback(200,tokenObject);
            } else {
              callback(500,{'Error':'Could not create the new token'});
            }
          });

        } else {
          callback(400,{'Error':'Password did not match the specified user\'s stored password'});
        }
      } else {
        callback(400,{'Error':'Could not find the specified user'});
      }
    });
  } else {
    callback(400,{'Error':'Missing required field(s)'});
  }
};

//tokens GET
handlers._tokens.get = function(data,callback){

};

//tokens PUT
handlers._tokens.put = function(data,callback){

};

//tokens DELETE
handlers._tokens.delete = function(data,callback){

};

//ping handler
handlers.ping = function(data,callback){
  callback(200);
};

//not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

//export the module
module.exports = handlers;
