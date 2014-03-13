module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      build: "dist"
    },
    connect: {
      server: {
        options: {
          port: 3000,
          protocol: 'http',
          hostname: 'localhost',
          base: '.',
          debug: false,
          livereload: true
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['*'],
        options: {
          spawn: false
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default', ['connect', 'watch']);
};