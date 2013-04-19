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
        outputFile: this.data.outputFile
      });

      // var files = this.files;
      var outputFile = options.outputFile;
      grunt.log.writeln('Depmodding ' + this.filesSrc.length + ' files. ');

      delete options.outputFile;

      var deps = depmod.getDepmod(this.filesSrc);
      var contents = JSON.stringify(deps);
      grunt.file.write(outputFile, contents);
    }
  );
};
