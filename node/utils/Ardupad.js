/*
 * Controls the communication with avr-gcc
 */


var util = require('util')
var spawn = require('child_process').spawn;
var async = require('async');
var settings = require('./Settings');
var os = require('os');

var doCompileTask;

var stdoutBuffer = "";

doCompileTask = function(task, callback)
{
    var gcc = spawn(settings.gcc, ['-o', task.destFile, task.srcFile]);

    gcc.stdout.on('data',
		  function (data)
		  {
		      stdoutBuffer += data.toString();
		  }
		 );

    gcc.stderr.on('data', function(data)
		  {
		      stdoutBuffer += data.toString();
		  });

    gcc.on('exit', function(code)
	   {
	       if (code != 0) {
	       	   throw "gcc died with exit code " + code;
	       }

	       if (stdoutBuffer != "") {
		   console.log(stdoutBuffer);
	       }

	       callback();
	   });


}
exports.compileFile = function(srcFile, destFile, type, callback)
{
    doCompileTask({'srcFile': srcFile, 'destFile':destFile, 'type':type}, callback);
};
