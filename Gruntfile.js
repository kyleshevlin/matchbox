'use strict';
module.exports = function(grunt) {
  // Load Grunt Tasks
  require('load-grunt-tasks')(grunt);

  // Initialize the Grunt object
  grunt.config.init({
    pkg: grunt.file.readJSON('package.json')
  });

  // Merge Style Tasks
  grunt.config.merge({
    // Autoprefixer
    autoprefixer: {
      dist: {
        files: {
          'build/application.css': 'assets/stylesheets/application.css'
        }
      }
    },

    // CSS Compilation
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/css/application.css': [
            'vendor/assets/stylesheets/resormalize.css',
            'build/application.css'
          ]
        }
      }
    },

    // Compile Sass
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'assets/stylesheets/application.css': 'assets/stylesheets/base.scss'
        }
      }
    },

    // LiveReload
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: '**/*.scss',
        tasks: ['sass', 'autoprefixer', 'cssmin', 'clean'],
        options: {
          spawn: false
        }
      }
    }
  });

  // Merge Tasks for JavaScript
  grunt.config.merge({
    // Babel - ES6
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/javascripts',
          src: '**/*.js',
          dest: 'build/babel'
        }]
      }
    },

    // Concatenate JS Files
    concat: {
      dist: {
        options: {
          separator: ';'
        },
        src: [
          // Declare scripts in order you want them concatenated
          'vendor/assets/javascripts/*.js',
          'build/babel/helpers.js',
          'bower_components/matchboxjs/matchbox.js',
          'bower_components/ev-emitter/ev-emitter.js',
          'bower_components/imagesloaded/imagesloaded.js',
          'build/babel/GSK.js',
          'build/babel/GSK.first_example.js',
          'build/babel/GSK.second_example.js',
          'build/babel/GSK.third_example.js',
          'build/babel/final.js'
        ],
        dest: 'dist/js/application.js',
      }
    },

    // Lint JavaScript with JSHint
    jshint: {
      files: {
        src: ['assets/javascripts/**/*.js', 'vendor/assets/javascripts/*.js']
      }
    },

    // Uglify JavaScript
    uglify: {
      options: {
        mangle: false
      },
      build: {
        src: 'dist/js/application.js',
        dest: 'dist/js/application.js'
      }
    },

    // LiveReload
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: '**/*.js',
        tasks: ['babel', 'concat', 'clean'],
        options: {
          spawn: false
        }
      }
    }
  });

  // Clean
  grunt.config.merge({
    clean: ['build']
  });

  // Local Server
  grunt.config.merge({
    connect: {
      server: {
        options: {
          keepalive : true
        }
      }
    }
  });

  // Register Tasks
  grunt.registerTask('base', ['sass', 'autoprefixer', 'cssmin', 'babel', 'concat']);
  grunt.registerTask('default', ['base', 'clean', 'watch']);
  grunt.registerTask('distribute', ['base', 'uglify', 'clean']);
};
