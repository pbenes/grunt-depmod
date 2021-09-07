module.exports = function(grunt) {
    grunt.initConfig({
        run: {
            testmocha: {
                options: {
                    wait: true
                },
                cmd: "jest",
                args: [
                    'test/test.js'
                ]
            },
        },
        depmod: {
            test: {
                src: 'test/fixtures/**/*.js',
                dest: 'test/fixtures/result.depmod.json'
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-run');

    grunt.loadTasks('tasks');

    grunt.registerTask('test', ['depmod:test', 'run:testmocha']);

    // Default task.
    grunt.registerTask('default', 'test');
};
