module.exports = function(grunt) {
  grunt.initConfig({
    // Tests
    simplemocha: {
      options: {
        ui: 'bdd',
        reporter: 'tap'
      },

      all: { src: 'test/test.js' }
    },

    depmod: {
        test: {
            // src: '../../html/**/[^\.]*.{css,js}',
            src: 'test/fixtures/**/*.js',
            outputFile: 'test/fixtures/result.depmod.json'
        }
    }
  });

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['depmod:test', 'simplemocha']);

  // Default task.
  grunt.registerTask('default', 'test');
};
