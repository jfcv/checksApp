/*
 *CLI related-tasks
 *
 */

 //dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();

//instantiate the CLI module object
var cli = {};

//input processor
cli.processInput = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;

  //only process the input if the user actually wrote sommething. Otherwise ignore it.
  if (str) {
    //codify the unique strings that identify the unique questions allowed to be asked
    var uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'list users',
      'more user info',
      'list checks',
      'more check info',
      'list logs',
      'more log info'
    ];

    //go through possible inputs, emit an event when a match is found
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some(function(input){
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        //emit an event matching the unique input, and include the full string given
        e.emit(input,str);
        return true;
      }
    });

    //if no match is found, tell the user to try again
    if(!matchFound){
      console.log('Sorry, try again');
    }
  }
};

//init script
cli.init = function(){
  //send the start message to the console, in dark blue
  console.log('\x1b[34m%s\x1b[0m','The CLI is running');

  //start the interface
  var _interface = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
    prompt : '',
  });

  //create the initial prompt
  _interface.prompt();

  //handle each line of input separately
  _interface.on('line',function(str){
    //send to the input processor
    cli.processInput(str);

    //re-initialize the prompt afterwards
    _interface.prompt();
  });

  //if the user kills the CLI, kill the associated process
  _interface.on('close',function(){
      process.exit(0);
  });

};


//export the module
module.exports = cli;
