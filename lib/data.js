/*
 *
 * Library for store & editing data
 *
 */

//dependencies
var fs = require('fs');
var path = require('path');

//container for the module
var lib = {};

//base directory
lib.baseDir = path.join(__dirname,'/../.data');

//write data to a file
lib.create = function(dir,file,data,callback){

  //open the file -> 'wx' flag meaning file for writing & executing
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
    if (!err && fileDescriptor) {

      //convert data to string
      var stringData = JSON.stringify(data);

      //write the data to the file & close it
      fs.writeFile(fileDescriptor,stringData,function(err){
        if (!err) {
          fs.close(fileDescriptor,function(err){
            if (!err) {
              callback(false);
            } else {
              callback('error closing new file')
            }
          })
        } else {
          callback('error writing new file');
        }
      })

    } else {
      callback('could not create new file, it may already exist');
    }
  });

};

//export the module
module.exports = lib;
