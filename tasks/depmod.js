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
            /**
             * Exclude srcFiles pathname regexp
             * @type {string}
             */
            // exclude: f.exclude,

            processName: f.processName
          });

          // exclude regexp string/list instantiation
          var exclude = f.exclude;
          if (typeof exclude === 'string') {
              exclude = [ exclude ];
          }
          exclude = exclude && exclude.map(function(e) { return new RegExp(e); });

          var srcs = f.src;
          if (exclude) srcs = srcs.filter(function(f) {
              return !exclude.some(function(e) { return e.test(f) });
          });

          grunt.log.writeln('Depmodding ' + srcs.length + ' files. ');

          var deps = depmod.getDepmod(srcs, options);
          var contents = JSON.stringify(deps);
          grunt.file.write(f.dest, contents);
      }, this);
  });
};
