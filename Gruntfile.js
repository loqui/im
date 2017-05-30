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
        flatten: false,
        filter: 'isFile'
      },
      srcToChrome: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/chrome/',
        filter: function(src) {
          return src.indexOf('.scss') < 0;
        }
      },
      chromeToDist: {
        expand: true,
        cwd: 'platform/chrome/',
        src: '**',
        dest: '<%= meta.build %>/chrome/',
        flatten: false,
        filter: 'isFile'
      },
      srcToUbuntuDesktop64: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/ubuntu-desktop64/opt/loquiim/www',
        flatten: false,
        filter: function(src) {
          return src.indexOf('.scss') < 0;
        }
      },
      ubuntudesktopToDist64: {
        expand: true,
        cwd: 'platform/ubuntu-touch/',
        src: 'loqui.png',
        dest: '<%= meta.build %>/ubuntu-desktop64/opt/loquiim/',
        flatten: false,
        filter: 'isFile'
      },
      ubuntudesktopFile64: {
        expand: true,
        cwd: 'platform/desktop/',
        src: 'loqui.desktop',
        dest: '<%= meta.build %>/ubuntu-desktop64/usr/share/applications/',
        flatten: false,
        filter: 'isFile'
      },
      ubuntudesktopWssrv64: {
        expand: true,
        cwd: 'platform/ubuntu-touch/lib/x86_64-linux-gnu/bin',
        src: 'wssrv-tcp',
        dest: '<%= meta.build %>/ubuntu-desktop64/usr/bin/',
        flatten: false,
        filter: 'isFile'
      },
      srcToUbuntuDesktop32: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/ubuntu-desktop32/opt/loquiim/www',
        flatten: false,
        filter: function(src) {
          return src.indexOf('.scss') < 0;
        }
      },
      ubuntudesktopToDist32: {
        expand: true,
        cwd: 'platform/ubuntu-touch/',
        src: 'loqui.png',
        dest: '<%= meta.build %>/ubuntu-desktop32/opt/loquiim/',
        flatten: false,
        filter: 'isFile'
      },
      ubuntudesktopFile32: {
        expand: true,
        cwd: 'platform/desktop/',
        src: 'loqui.desktop',
        dest: '<%= meta.build %>/ubuntu-desktop32/usr/share/applications/',
        flatten: false,
        filter: 'isFile'
      },
      ubuntudesktopWssrv32: {
        expand: true,
        cwd: 'platform/ubuntu-touch/lib/i386-linux-gnu/bin',
        src: 'wssrv-tcp',
        dest: '<%= meta.build %>/ubuntu-desktop32/usr/bin/',
        flatten: false,
        filter: 'isFile'
      },
      srcToUbuntuDesktopArm: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/ubuntu-desktopArm/opt/loquiim/www',
        flatten: false,
        filter: function(src) {
          return src.indexOf('.scss') < 0;
        }
      },
      ubuntudesktopToDistArm: {
        expand: true,
        cwd: 'platform/ubuntu-touch/',
        src: 'loqui.png',
        dest: '<%= meta.build %>/ubuntu-desktopArm/opt/loquiim/',
        flatten: false,
        filter: 'isFile'
      },
      ubuntudesktopFileArm: {
        expand: true,
        cwd: 'platform/desktop/',
        src: 'loqui.desktop',
        dest: '<%= meta.build %>/ubuntu-desktopArm/usr/share/applications/',
        flatten: false,
        filter: 'isFile'
      },
      ubuntudesktopWssrvArm: {
        expand: true,
        cwd: 'platform/ubuntu-touch/lib/arm-linux-gnueabihf/bin',
        src: 'wssrv-tcp',
        dest: '<%= meta.build %>/ubuntu-desktopArm/usr/bin/',
        flatten: false,
        filter: 'isFile'
      },
      srcToUbuntuTouch: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/ubuntu-touch/www',
        flatten: false,
        filter: function(src) {
          return src.indexOf('.scss') < 0;
        }
      },
      ubuntutouchToDist: {
        expand: true,
        cwd: 'platform/ubuntu-touch/',
        src: '**',
        dest: '<%= meta.build %>/ubuntu-touch/',
        flatten: false,
        filter: 'isFile'
      },
      srcToCordova: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/cordova/www',
        flatten: false,
        filter: function(src) {
          return src.indexOf('.scss') < 0;
        }
      },
      cordovaToDist: {
        expand: true,
        cwd: 'platform/cordova/',
        src: '**',
        dest: '<%= meta.build %>/cordova/',
        flatten: false,
        filter: 'isFile'
      },
      srcToDesktop: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: '<%= meta.build %>/desktop/',
        flatten: false,
        filter: function(src) {
          return src.indexOf('.scss') < 0;
        }
      },
      desktopToDist: {
        expand: true,
        cwd: 'platform/desktop/',
        src: '**',
        dest: '<%= meta.build %>/desktop/',
        flatten: false,
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
    sed: {
      appversion: {
        path: '<%= meta.build %>/',
        pattern: '[$][(]Loqui[.]Version[)]',
        replacement: '<%= pkg.version %>',
        recursive: true
      },
      appminorversion: {
        path: '<%= meta.build %>/',
        pattern: '[$][(]Loqui[.]MinorVersion[)]',
        replacement: '<%= pkg.minorVersion %>',
        recursive: true
      },
      manifest: {
        path: '<%= meta.build %>/chrome/index.html',
        pattern: '</head>',
        replacement: '    <link rel="manifest" href="manifest.json" />\n</head>'
      },
      chromeversion: {
        path: '<%= meta.build %>/chrome/manifest.json',
        pattern: '"version": "v',
        replacement: '"version": "'
      },
      chromejsversion: {
        path: '<%= meta.build %>/chrome/index.html',
        pattern: ';version=1[.]7',
        replacement: ''
      },
      ubuntuTouchjsversion: {
        path: '<%= meta.build %>/ubuntu-touch/www/index.html',
        pattern: ';version=1[.]7',
        replacement: ''
      },
      ubuntuDesktop64jsversion: {
        path: '<%= meta.build %>/ubuntu-desktop64/opt/loquiim/www/index.html',
        pattern: ';version=1[.]7',
        replacement: ''
      },
      ubuntuDesktop32jsversion: {
        path: '<%= meta.build %>/ubuntu-desktop32/opt/loquiim/www/index.html',
        pattern: ';version=1[.]7',
        replacement: ''
      },
      ubuntuDesktopArmjsversion: {
        path: '<%= meta.build %>/ubuntu-desktopArm/opt/loquiim/www/index.html',
        pattern: ';version=1[.]7',
        replacement: ''
      },
      ubuntumanifestversion: {
        path: '<%= meta.build %>/ubuntu-touch/manifest.json',
        pattern: '"version": "v',
        replacement: '"version": "'
      },
      cordovajsversion: {
        path: '<%= meta.build %>/cordova/www/index.html',
        pattern: ';version=1[.]7',
        replacement: ''
      }
    },
    sass: {
        compile: {
            files: {
                'src/style/loqui/index.css' : 'src/style/loqui/index.scss'
            }
        }
    },
	debian_package: {
	    options: {
		maintainer: {
		    name: "LoquiIM Community",
		    email: "nfsprodriver@t-online.de"
		},
		prefix: "",
		name: "loquiim",
		postfix: ".nfsprodriver",
		short_description: "Chat Messenger",
		long_description: "Loqui Instant Messenger unifies all your chat accounts in just one app",
		version: "0.5.20",
		build_number: "1",
		target_architecture: "amd64",
		category: "communication", 
		dependencies: "webbrowser-app"
	    },
	    files:
		{
		    expand: true,
		    cwd: "dist/ubuntu-desktop64/",
		    src: [              // actual pattern(s) to match 
		        '**'
		    ],
		    dest: '/'   // destination path prefix 
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
  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-debian-package');
  grunt.registerTask('default', ['clean:build', 'execute', 'sass', 'copy', 'sed', 'clean:css', 'compress']);
  grunt.registerTask('with-desktop', ['clean', 'execute', 'sass', 'copy', 'sed', 'clean:css', 'compress', 'nodewebkit']);
  grunt.registerTask('devel', ['connect', 'watch']);
  grunt.registerTask('docstrap', ['copy:importDocstrapTemplate', 'copy:importJsdocConfig', 'copy:logoToDocstrap']);
};