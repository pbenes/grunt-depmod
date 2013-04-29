/*global node:true*/
/*
 * grunt-depmod-resolve
 *
 * Copyright (c) 2013 GoodData Corporation
 */
module.exports = function (grunt) {

var cnt= 0;
  function resolve(mods, modName, resolved) {
      var mod = mods[modName];
      if (!mod || resolved[modName]) return [];
      resolved[modName] = true;

      var deps = [];
      mod.requires && mod.requires.forEach(function(n) {
          deps.push.apply(deps, resolve(mods, n, resolved));
      });
      deps.push(mod);

      return deps;
  }

  grunt.registerMultiTask('depmod-resolve', 'Resolve dependencies.',
    function () {

      var options = this.options({
        /**
         * If specified, write output to this path instead of writing to
         * standard output.
         * @type {string}
         */
        outputFile: this.data.outputFile,

        /**
         * The modules information file pathname which was created as the
         * outputFile of the 'depmod' task.
         * @type {string}
         */
        modulesInfo: this.data.modulesInfo,

        /**
         * The module name to output the ordered dependency list of.
         * @type {string}
         */
        module: this.data.module
      });

      var depmod = grunt.file.read(options.modulesInfo);
      depmod = depmod && JSON.parse(depmod);

      var deps = resolve(depmod, options.module, {});
      deps = deps.map(function(m) { return m.name +" : "+m.path; });

      if (options.outputFile) {
          grunt.file.write(options.outputFile, JSON.stringify(deps, null, 2));
      } else {
          console.log(deps);
      }
    }
  );
};
