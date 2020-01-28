/*
 *
 * Primary file for the API
 *
 */

//dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var cluster = require('cluster');
var os = require('os');

//declare the app
var app = {};

//init function
app.init = function(callback){

  //if we're on the master thread, start the background workers and the CLI
  if (cluster.isMaster) {

    //start the workers
    workers.init();

    //start the CLI, but make sure it starts last
    setTimeout(function(){
      cli.init();
      callback();
    },50);

    //fork the process
    for(var i = 0; i < os.cpus().length; i++){
      cluster.fork();
    }

  } else {

    //if we're not on the master thread, start the HTTP server
    server.init();
  }
};

//self invoking only if required directly
if (require.main === module) {
    app.init(function(){});
}

//export the app
module.exports = app; //for testing issues
