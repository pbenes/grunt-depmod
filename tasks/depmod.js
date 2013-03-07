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
        outputFile: './html/scripts/depmod.js'
      });

      // console.log(require('util').inspect(this), this.filesSrc);
      // console.log(this.files.src);
      grunt.log.writeln('Depmodding ' + this.filesSrc.length + ' files.');
      // var files = this.files;
      var outputFile = options.outputFile;

      delete options.outputFile;

      var json = JSON.stringify(depmod.getDepmod(this.filesSrc)).replace(/},"/g, "}\n,\n\"");
      var contents = "// THIS IS A GENERATED FILE, run 'grunt depmod' to rebuild\n"+
                     "//\n"+
                     "window.GDC = window.GDC || {};\n"+
                     "GDC.YUIConfig = GDC.YUIConfig || {};\n"+
                     "GDC.YUIConfig.modules =\n"+
                     "{  //BEG-JSON\n" + json.substring(1, (json.length-1)) + "\n}; //END-JSON";
      grunt.file.write(outputFile, contents);
    }
  );
};