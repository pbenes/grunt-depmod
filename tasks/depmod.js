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
        exclude: this.data.exclude
      });

      var exclude = options.exclude && new RegExp(options.exclude);
      var files = this.filesSrc;
      if (exclude) files = files.filter(function(f) {
          return !exclude.test(f);
      });

      var outputFile = options.outputFile;
      grunt.log.writeln('Depmodding ' + files.length + ' files. ');

      delete options.outputFile;

      var deps = depmod.getDepmod(files);
      var contents = JSON.stringify(deps);
      grunt.file.write(outputFile, contents);
    }
  );
};
