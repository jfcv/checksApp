/*
 *
 * Library for store & editing data
 *
 */

//dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

//container for the module
var lib = {};

//base directory
lib.baseDir = path.join(__dirname,'/../.data/');

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
      });

    } else {
      callback('could not create new file, it may already exist');
    }
  });

};

//read data from a file
lib.read = function(dir,file,callback){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
    if (!err && data) {
      var parsedData = helpers.parseJsonToObject(data);
      callback(false,parsedData);
    } else {
      callback(err,data);
    }
  });
};

//update data inside a file
lib.update = function(dir,file,data,callback){

  //open the file
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
    if (!err && fileDescriptor) {

      //convert data to string
      var stringData = JSON.stringify(data);

      //truncate the file
      fs.ftruncate(fileDescriptor,function(err){
        if (!err) {
          fs.writeFile(fileDescriptor,stringData,function(err){
            if (!err) {
              fs.close(fileDescriptor,function(err){
                if (!err) {
                  callback(false);
                } else {
                  callback('error closing the existing file');
                }
              });
            } else {
              callback('error writing to the existing file');
            }
          });
        } else {
          callback('error truncating file');
        }
      });
    } else {
      callback('could not open the file for updating');
    }
  });
};

//delete a file
lib.delete = function(dir,file,callback){

    //unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
      if (!err) {
        callback(false);
      } else {
        callback('error deleting the file');
      }
    });

};

//list all items in a directory
lib.list = function(dir,callback){
  fs.readdir(lib.baseDir+dir+'/',function(err,data){
    if (!err && data && data.length > 0) {
      var trimmedFileNames = [];
      data.forEach(function(fileName) {
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false,trimmedFileNames);
    } else {
      callback(err,data);
    }
  });
};

//export the module
module.exports = lib;
