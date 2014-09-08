module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      build: "dist",
      compress: "package"
    },
    copy: {
      srcToFirefoxos: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/firefoxos/'
      },
      firefoxosToDist: {
        expand: true,
        cwd: 'platform/firefoxos/',
        src: '**',
        dest: '<%= meta.build %>/firefoxos/',
        flatten: true,
        filter: 'isFile'
      },
      srcToUbuntuTouch: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/ubuntu-touch/www',
        flatten: true,
        filter: 'isFile'
      },
      ubuntutouchToDist: {
        expand: true,
        cwd: 'platform/ubuntu-touch/',
        src: '**',
        dest: '<%= meta.build %>/ubuntu-touch/',
        flatten: true,
        filter: 'isFile'
      },
      srcToDesktop: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/desktop/',
        flatten: true,
        filter: 'isFile'
      },
      desktopToDist: {
        expand: true,
        cwd: 'platform/desktop/',
        src: '**',
        dest: '<%= meta.build %>/desktop/',
        flatten: true,
        filter: 'isFile'
      }
    },
    clean: {
      build: {
        src: ['<%= meta.build %>/*', '<%= meta.compress %>/*', '<%= meta.build %>/**/*', 'cache/*', 'cache/**/*']
      }
    },
    compress: {
      firefoxos: {
        options: {
          archive: '<%= meta.compress %>/LoquiIM-<%= pkg.version %>-firefoxos.zip'
        },
        files: [{
          expand: true, 
          cwd: '<%= meta.build %>/firefoxos/', 
          src: ['**'], 
          dest: ''
        }]
      },
      ubuntutouch: {
        options: {
          archive: '<%= meta.compress %>/LoquiIM-<%= pkg.version %>-ubuntutouch.zip'
        },
        files: [{
          expand: true, 
          cwd: '<%= meta.build %>/ubuntu-touch/', 
          src: ['**'], 
          dest: ''
        }]
      }
    },
    nodewebkit: {
      options: {
        platforms: ['win', 'osx', 'linux32', 'linux64'],
        buildDir: '<%= meta.compress %>/desktop',
      },
      src: ['dist/desktop/**/*'] 
    },
    connect: {
      server: {
        options: {
          port: 3000,
          protocol: 'http',
          hostname: 'localhost',
          base: '/src',
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
        files: ['src/*', 'src/**/*'],
        options: {
          spawn: false
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['clean', 'copy', 'compress']);
  grunt.registerTask('with-desktop', ['clean', 'copy', 'compress', 'nodewebkit']);
  grunt.registerTask('devel', ['connect', 'watch']);
};
