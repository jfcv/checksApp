/*
 *
 * Primary file for the API
 *
 */

//dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

//declare the app
var app = {};

//declare a global (that strict mode should cathc)
foo = 'bar';

//init function
app.init = function(){
  //start the server
  server.init();

  //start the workers
  workers.init();

  //start the CLI, but make sure it starts last
  setTimeout(function(){
    cli.init();
  },50);
};

//execute the app
app.init();

//export the app
module.exports = app; //for testing issues
