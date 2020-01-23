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

//input handlers
e.on('man',function(str){
  cli.responders.help();
});

e.on('help',function(str){
  cli.responders.help();
});

e.on('exit',function(str){
  cli.responders.exit();
});

e.on('stats',function(str){
  cli.responders.stats();
});

e.on('list users',function(str){
  cli.responders.listUsers();
});

e.on('more user info',function(str){
  cli.responders.moreUserInfo(str);
});

e.on('list checks',function(str){
  cli.responders.listChecks(str);
});

e.on('more check info',function(str){
  cli.responders.moreCheckInfo(str);
});

e.on('list logs',function(str){
  cli.responders.listLogs();
});

e.on('more log info',function(str){
  cli.responders.moreLogInfo(str);
});

//responders object
cli.responders = {};

//help - man
cli.responders.help = function(){
  console.log('You asked for help');
};

//exit
cli.responders.exit = function(){
  console.log('You asked for exit');
};

//stats
cli.responders.stats = function(){
  console.log('You asked for stats');
};

//list users
cli.responders.listUsers = function(){
  console.log('You asked to list users');
};

//more user info
cli.responders.moreUserInfo = function(str){
  console.log('You asked for more user info',str);
};

//list checks
cli.responders.listChecks = function(str){
  console.log('You asked to list checks',str);
};

//more check info
cli.responders.moreCheckInfo = function(str){
  console.log('You asked for more check info',str);
};

//list logs
cli.responders.listLogs = function(){
  console.log('You asked to list logs');
};

//more log info
cli.responders.moreLogInfo = function(str){
  console.log('You asked for more log info',str);
};

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
