/*global node:true*/
/*
 * grunt-depmod
 *
 * Copyright (c) 2013 GoodData Corporation
 */
module.exports = function (grunt) {

  var path = require('path'),
      depmod = require('../lib/esprima-depmod');

  // TODO: investigate why multiTask is necessary to have this.filesSrc
  grunt.registerMultiTask('depmod', 'Calculate dependencies.', function () {
      this.files.forEach(function(f) {
          var options = this.options({
            callback: f.callback,
            processName: f.processName
          });

          grunt.log.writeln('Depmodding ' + f.src.length + ' files. ');

          var deps = depmod.getDepmod(f.src, options);
          if (f.dest) {
              var contents = JSON.stringify(deps);
              grunt.file.write(f.dest, contents);
          }
      }, this);
  });
};
