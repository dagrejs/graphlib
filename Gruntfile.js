module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    moduleName: pkg.name,
    moduleJs: '<%= moduleName %>.js',
    moduleMinJs: '<%= moduleName %>.min.js',
    browserify: {
      build: {
        files: {
          'build/<%= moduleJs %>': ['browser.js']
        }
      }
    },
    copy: {
      dist: {
        files: [
          {expand: true, cwd: 'build', src: '<%= moduleJs %>', dest: 'dist/'},
          {expand: true, cwd: 'build', src: '<%= moduleMinJs %>', dest: 'dist/'},
          {expand: true, cwd: 'build/doc', src: '**', dest: 'dist/doc/'}
        ]
      },
      doc: {
        expand: true,
        cwd: 'doc/static',
        src: '**',
        dest: 'build/doc/static'
      }
    },
    jade: {
      doc: {
        options: {
          data: {
            version: pkg.version
          },
          pretty: true
        },
        files: {
          'build/doc/index.html': ['doc/index.jade']
        }
      }
    },
    jshint: {
      options: {
        eqeqeq: true,
        newcap: true,
        quotmark: true,
        unused: true,
        trailing: true,
        laxbreak: true
      },
      src: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },
    mochacov: {
      test: {
        options: {
          reporter: 'dot',
          files: ['test/**/*.js']
        }
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          output: 'build/coverage.html',
          files: ['test/**/*.js']
        }
      }
    },
    uglify: {
      build: {
        files: {
          'build/<%= moduleMinJs %>': ['build/<%= moduleJs %>']
        }
      }
    },
    watch: {
      src: {
        files: ['lib/**/*.js', 'test/**/*.js', '!lib/version.js'],
        tasks: ['test', 'jshint:src:'],
        options: {
          spawn: false
        }
      },
    }
  });

  // Plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-cov');

  // Optional configuration
  if (grunt.option('debug-brk')) {
    grunt.config('mochacov.test.options.debug-brk', true);
  }

  // Main invocable targets
  grunt.registerTask('default', ['dist', 'test']);

  grunt.registerTask('build', ['_init', 'browserify', 'uglify']);

  grunt.registerTask('dist', ['build', 'doc', 'copy:dist']);

  grunt.registerTask('doc', ['_init', 'jade:doc', 'copy:doc']);

  grunt.registerTask('test', ['_init', 'mochacov:test', 'mochacov:coverage']);

  grunt.registerTask('bench', ['_init', '_bench']);

  grunt.registerTask('release', ['dist', '_release']);

  grunt.registerTask('clean', 'Deletes temporary files and dist files', function() {
    deleteFile('lib/version.js');
    deleteDir('build');
    deleteDir('dist');
  });

  // Supporting targets (should be private...)
  grunt.registerTask('_init', function() {
    grunt.file.mkdir('build');
    grunt.file.write('lib/version.js', 'module.exports = \'' + pkg.version + '\';');
  });

  grunt.registerTask('_bench', function() {
    require('./bench/bench');
  });

  grunt.registerTask('_release', function() {
    var done = this.async();
    var child = grunt.util.spawn({
      cmd: 'src/release/release.sh',
      args: [grunt.config('moduleName'), 'dist']
    }, done);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

  function deleteFile(file) {
    if (grunt.file.isFile(file)) {
      grunt.file.delete(file);
    }
  }

  function deleteDir(dir) {
    if (grunt.file.isDir(dir)) {
      grunt.file.delete(dir);
    }
  }
};

