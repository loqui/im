module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      build: "dist",
      compress: "package"
    },
    copy: {
      importDocstrapTemplate: {
        src: 'docstrap/template.less',
        dest: 'node_modules/ink-docstrap/styles/variables.less'
      },
      importJsdocConfig: {
        src: 'jsdoc/config.json',
        dest: 'node_modules/ink-docstrap/template/jsdoc.conf.json'
      },
      logoToDocstrap: {
        src: 'src/img/icon-128.png',
        dest: 'node_modules/ink-docstrap/template/static/img/logo.png'
      },
      srcToFirefoxos: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/firefoxos/',
        filter: function(src) {
          return src.indexOf('.scss') < 0;
        }
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
      },

      css: {
        src: ['src/style/loqui/index.css']
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
    },
    execute: {
      renderersCompiler: {
        src: ['renderersCompiler.js']
      }
    },
    sass: {
        compile: {
            files: {
                'src/style/loqui/index.css' : 'src/style/loqui/index.scss'
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
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-execute');
  grunt.registerTask('default', ['clean:build', 'execute', 'sass', 'copy', 'clean:css', 'compress']);
  grunt.registerTask('with-desktop', ['clean', 'execute', 'sass', 'copy', 'clean:css', 'compress', 'nodewebkit']);
  grunt.registerTask('devel', ['connect', 'watch']);
  grunt.registerTask('docstrap', ['copy:importDocstrapTemplate', 'copy:importJsdocConfig', 'copy:logoToDocstrap']);
};
