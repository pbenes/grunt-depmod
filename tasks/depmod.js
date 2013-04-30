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
  grunt.registerMultiTask('depmod', 'Calculate dependencies.',
    function () {

      var options = this.options({
        /**
         * If specified, write output to this path instead of writing to
         * standard output.
         * @type {string}
         */
        outputFile: this.data.outputFile,

        /**
         * Exclude srcFiles pathname regexp
         * @type {string}
         */
        exclude: this.data.exclude,

        processName: this.data.processName
      });

      var exclude = options.exclude;
      if (typeof exclude === 'string') {
          exclude = [ exclude ];
      }
      exclude = exclude && exclude.map(function(e) { return new RegExp(e); });

      var files = this.filesSrc;
      if (exclude) files = files.filter(function(f) {
          return !exclude.some(function(e) { return e.test(f) });
      });

      var outputFile = options.outputFile;
      grunt.log.writeln('Depmodding ' + files.length + ' files. ');

      delete options.outputFile;

      var deps = depmod.getDepmod(files, options);
      var contents = JSON.stringify(deps);
      grunt.file.write(outputFile, contents);
    }
  );
};
