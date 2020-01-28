/*
 *example REPL server
 *take in the word 'fizz' and log out 'buzz'
 *
 */

//dependencies
var repl = require('repl');

//start the REPL
repl.start({
  'prompt' : '>',
  'eval' : function(str) {
    //evaluation function for incoming inputs
    console.log('At the evaluation stage: ',str);

    //if the user said 'fizz', say 'buzz' back to them
    if (str.indexOf('fizz') > -1) {
      console.log('buzz');
    }
  }
});
