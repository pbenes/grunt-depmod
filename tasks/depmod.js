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
      var type = options.type || 'old'; // generate depmod for rake our just plain JSON?

      delete options.type;
      delete options.outputFile;

      var contents = '';
      var deps = depmod.getDepmod(this.filesSrc);
      if (type == 'old') {
        var json = JSON.stringify(deps).replace(/},"/g, "}\n,\n\"");
        contents = "// THIS IS A GENERATED FILE, run 'grunt depmod' to rebuild\n"+
                   "//\n"+
                   "window.GDC = window.GDC || {};\n"+
                   "GDC.YUIConfig = GDC.YUIConfig || {};\n"+
                   "GDC.YUIConfig.modules =\n"+
                   "{  //BEG-JSON\n" + json.substring(1, (json.length-1)) + "\n}; //END-JSON";
      } else {
        contents = 'module.exports = ' + JSON.stringify(deps).replace(/},"/g, "}\n,\n\"");
      }
      grunt.file.write(outputFile, contents);
    }
  );
};