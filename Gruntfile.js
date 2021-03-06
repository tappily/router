module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt, {
    pattern: ['assemble', 'grunt-*'],
    scope: ['devDependencies']
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assemble: {
      options: {
        assets: '<%= connect.site.options.base %>/assets',
        data: ['package.json', 'src/data/*.{yml,json}'],
        helpers: 'src/templates/helpers/helper-*.js',
        layoutdir: 'src/templates/layouts',
        partials: [
          'src/templates/partials/*.hbs',
          'src/templates/layouts/*.hbs'],
        layout: 'default.hbs',
        flatten: true
      },
      index: {
        options: {
          data: ['src/data/index/*.{yml,json}'],
          layout: 'router.hbs'
        },
        src: ['src/templates/site/*.hbs'],
        dest: '<%= connect.site.options.base %>/'
      }
    },
    autoprefixer: {
      dist: {
        expand: true,
        flatten: true,
        src: 'tmp/css/*.css',
        dest: 'dist/css/'
      },
      site: {
        src: '<%= assemble.options.assets %>/css/*.css'
      }
    },
    clean: {
      temp: ['tmp'],
      dist: ['dist']
    },
    connect: {
      options: {
        hostname: grunt.option('connect-hostname') || 'localhost',
        port: 9000
      },
      site: {
        options: {
          base: 'tmp/assemble/<%= pkg.name %>',
          livereload: true,
          open: true
        }
      }
    },
    copy: {
      assets: {
        files: [
          {
            expand: true,
            cwd: 'src/assets',
            src: ['**/*'],
            dest: '<%= connect.site.options.base %>/assets/',
            filter: 'isFile'
          }
        ]
      }
    },
    csslint: {
      options: grunt.file.readYAML('csslint.yml'),
      site: {
        src: ['<%= autoprefixer.site.src %>']
      },
      dist: {
        formatters: [
          { id: 'junit-xml', dest: 'dist/report/csslint_junit.xml'},
          { id: 'csslint-xml', dest: 'dist/report/csslint.xml'}
        ],
        src: ['<%= autoprefixer.dist.dest %>*.css']
      }
    },
    'gh-pages': {
      options: {
        base: '<%= connect.site.options.base %>'
      },
      src: '**/*'
    },
    jshint: {
      options: grunt.file.readYAML('jshint.yml'),
      configurations: ['Gruntfile.js', 'bower.json', 'package.json'],
      sources: ['src/**/*.js']
    },
    sass: {
      options: {
        sourcemap: true
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'src/scss/app',
          src: ['**/*.scss'],
          dest: 'dist/css/',
          ext: '.css'
        }]
      },
      site: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'src/scss/site',
          src: ['**/*.scss'],
          dest: '<%= assemble.options.assets %>/css/',
          ext: '.css'
        }]
      }
    },
    newer: {},
    release: {},
    watch: {
      options: {
        livereload: true
      },
      asset: {
        files: ['src/assets/**/*'],
        tasks: ['newer:copy:assets']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['site']
      },
      js: {
        files: ['src/js/**/*.js', './*.js'],
        tasks: ['newer:jshint']
      },
      json: {
        files: ['src/data/**/*.{json,yml}'],
        tasks: ['newer:jshint', 'assemble']
      },
      scss: {
        files: 'src/**/*.scss',
        tasks: ['sass:site', 'newer:autoprefixer:site', 'newer:csslint:site']
      },
      template: {
        files: 'src/templates/**/*.{js,hbs}',
        tasks: ['assemble']
      }
    }
  });

  grunt.task.registerTask('default', [ 'test' ]);
  grunt.task.registerTask('test', ['clean', 'jshint', 'sass', 'autoprefixer', 'csslint']);
  grunt.task.registerTask('build', ['clean', 'jshint', 'sass', 'autoprefixer:dist', 'csslint:dist']);
  grunt.task.registerTask('site', ['clean', 'jshint', 'sass:site', 'autoprefixer:site', 'csslint:site', 'assemble', 'copy:assets']);
  grunt.task.registerTask('deploy', ['site', 'gh-pages']);
  grunt.task.registerTask('live', ['site', 'connect:site', 'watch']);
};
