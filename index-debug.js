/*
 *
 * Primary file for the API
 *
 */

//dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

//declare the app
var app = {};

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

  //set foo at 1
  var foo = 1;

  //increment foo
  foo++;

  //square foo
  foo = foo * foo;

  //convert foo to a string
  foo = foo.toString();

  //call the init script that will throw
  exampleDebuggingProblem.init();
};

//execute the app
app.init();

//export the app
module.exports = app; //for testing issues
