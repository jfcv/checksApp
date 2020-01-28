/*
 *example vm
 *running some arbitrary commands
 *
 */

//dependencies
var vm = require('vm');

//define a context for the script to run in
var context = {
  'foo' : 25
};

//define the script
var script = new vm.Script(`
  foo = foo * 2;
  var bar = foo + 1;
  var fizz = 52;
`);

//run the script
script.runInNewContext(context);
console.log(context);
