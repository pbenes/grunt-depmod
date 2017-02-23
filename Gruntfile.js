module.exports = function(grunt) {
    grunt.initConfig({
        simplemocha: {
            options: {
                ui: 'bdd',
                reporter: 'tap'
            },

            all: {
                src: 'test/test.js'
            }
        },

        depmod: {
            test: {
                src: 'test/fixtures/**/*.js',
                dest: 'test/fixtures/result.depmod.json'
            }
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadTasks('tasks');

    grunt.registerTask('test', ['depmod:test', 'simplemocha']);

    // Default task.
    grunt.registerTask('default', 'test');
};
